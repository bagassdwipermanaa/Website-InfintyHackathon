const express = require('express');
const { User, Artwork, Certificate, Verification } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'avatar', 'bio', 'website', 'socialLinks', 'createdAt'],
      include: [
        {
          model: Artwork,
          as: 'artworks',
          where: { isPublic: true },
          required: false,
          attributes: ['id', 'title', 'category', 'createdAt', 'status'],
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get public stats
    const publicArtworksCount = await Artwork.count({
      where: { 
        userId: user.id,
        isPublic: true,
        status: 'verified'
      }
    });

    const totalViews = await Artwork.sum('viewCount', {
      where: { 
        userId: user.id,
        isPublic: true
      }
    });

    res.json({
      success: true,
      user: {
        ...user.toJSON(),
        stats: {
          publicArtworks: publicArtworksCount,
          totalViews: totalViews || 0
        }
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user's profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Artwork,
          as: 'artworks',
          attributes: ['id', 'title', 'status', 'createdAt'],
          limit: 10,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    res.json({
      success: true,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, bio, website, socialLinks, preferences } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (preferences) updateData.preferences = preferences;

    await req.user.update(updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: req.user.toJSON()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    let dateFilter;
    if (period !== 'all') {
      const now = new Date();
      const days = parseInt(period.replace('d', ''));
      dateFilter = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }

    const whereClause = { userId: req.user.id };
    if (dateFilter) {
      whereClause.createdAt = { [Op.gte]: dateFilter };
    }

    // Artwork statistics
    const artworksByStatus = await Artwork.findAll({
      where: whereClause,
      attributes: [
        'status',
        [Artwork.sequelize.fn('COUNT', Artwork.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const totalViews = await Artwork.sum('viewCount', { where: whereClause });
    const totalVerifications = await Artwork.sum('verificationCount', { where: whereClause });

    // Certificate statistics
    const certificatesByType = await Certificate.findAll({
      where: { userId: req.user.id },
      attributes: [
        'type',
        [Certificate.sequelize.fn('COUNT', Certificate.sequelize.col('id')), 'count']
      ],
      group: ['type'],
      raw: true
    });

    const totalDownloads = await Certificate.sum('downloadCount', {
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      stats: {
        artworks: {
          byStatus: artworksByStatus.reduce((acc, stat) => {
            acc[stat.status] = parseInt(stat.count);
            return acc;
          }, {}),
          totalViews: totalViews || 0,
          totalVerifications: totalVerifications || 0
        },
        certificates: {
          byType: certificatesByType.reduce((acc, cert) => {
            acc[cert.type] = parseInt(cert.count);
            return acc;
          }, {}),
          totalDownloads: totalDownloads || 0
        },
        period
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } }
        ],
        isActive: true
      },
      attributes: ['id', 'name', 'avatar', 'bio'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      users,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's activity feed
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Get recent artworks
    const recentArtworks = await Artwork.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'title', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get recent verifications of user's artworks
    const recentVerifications = await Verification.findAll({
      include: [
        {
          model: Artwork,
          as: 'artwork',
          where: { userId: req.user.id },
          attributes: ['id', 'title']
        }
      ],
      where: { isSuccessful: true },
      attributes: ['id', 'verificationType', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get recent certificate downloads
    const recentDownloads = await Certificate.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'certificateNumber', 'downloadCount', 'lastDownloadedAt'],
      include: [
        {
          model: Artwork,
          as: 'artwork',
          attributes: ['id', 'title']
        }
      ],
      where: {
        userId: req.user.id,
        downloadCount: { [Op.gt]: 0 }
      },
      order: [['lastDownloadedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      activity: {
        artworks: recentArtworks,
        verifications: recentVerifications,
        downloads: recentDownloads
      }
    });

  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Deactivate account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;

    // Verify password if user has one
    if (req.user.password) {
      const isValidPassword = await req.user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password'
        });
      }
    }

    // Deactivate user account
    await req.user.update({ isActive: false });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
