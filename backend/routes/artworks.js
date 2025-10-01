const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, Artwork, Certificate, Verification } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { uploadArtwork, handleUploadError, generateFileHash, extractFileMetadata } = require('../middleware/upload');
const { Op } = require('sequelize');

const router = express.Router();

// Upload artwork
router.post('/upload',
  authenticateToken,
  uploadArtwork,
  handleUploadError,
  [
    body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required and must be less than 255 characters'),
    body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('category').optional().isIn(['art', 'music', 'video', 'writing', 'photography', 'design', 'code', 'other']).withMessage('Invalid category'),
    body('tags').optional().isString().withMessage('Tags must be a string'),
    body('license').optional().isIn(['all-rights-reserved', 'creative-commons', 'public-domain', 'commercial-use']).withMessage('Invalid license')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { title, description, category, tags, license } = req.body;

      // Generate file hash
      const fileHash = await generateFileHash(req.file.path);

      // Check if artwork with same hash already exists
      const existingArtwork = await Artwork.findOne({ where: { fileHash } });
      if (existingArtwork) {
        return res.status(409).json({
          success: false,
          message: 'Artwork with this file already exists',
          existingArtwork: {
            id: existingArtwork.id,
            title: existingArtwork.title,
            creator: existingArtwork.creator?.name
          }
        });
      }

      // Extract file metadata
      const metadata = await extractFileMetadata(req.file.path, req.file.mimetype);

      // Parse tags
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      // Create artwork
      const artwork = await Artwork.create({
        userId: req.user.id,
        title,
        description: description || null,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        fileHash,
        category: category || null,
        tags: tagsArray,
        license: license || 'all-rights-reserved',
        metadata,
        status: 'pending'
      });

      // TODO: Store hash on blockchain
      // This would involve calling a smart contract

      // Generate certificate
      const certificate = await Certificate.create({
        artworkId: artwork.id,
        userId: req.user.id,
        certificateNumber: `BR-${Date.now()}-${artwork.id.substring(0, 8).toUpperCase()}`,
        type: 'pdf'
      });

      // Update artwork with certificate URL
      await artwork.update({
        certificateUrl: `/api/certificates/${certificate.id}/download`
      });

      res.status(201).json({
        success: true,
        message: 'Artwork uploaded successfully',
        artwork: {
          id: artwork.id,
          title: artwork.title,
          description: artwork.description,
          fileHash: artwork.fileHash,
          fileType: artwork.fileType,
          fileSize: artwork.fileSize,
          createdAt: artwork.createdAt,
          status: artwork.status,
          certificateUrl: artwork.certificateUrl
        }
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Get user's artworks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;

    const { count, rows: artworks } = await Artwork.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      artworks,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get artworks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get artwork by ID
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'walletAddress']
        },
        {
          model: Certificate,
          as: 'certificates',
          where: { isActive: true },
          required: false
        }
      ]
    });

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Increment view count
    await artwork.increment('viewCount');

    res.json({
      success: true,
      artwork
    });

  } catch (error) {
    console.error('Get artwork error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update artwork
router.put('/:id', authenticateToken, [
  body('title').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Title must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('category').optional().isIn(['art', 'music', 'video', 'writing', 'photography', 'design', 'code', 'other']).withMessage('Invalid category'),
  body('tags').optional().isString().withMessage('Tags must be a string'),
  body('license').optional().isIn(['all-rights-reserved', 'creative-commons', 'public-domain', 'commercial-use']).withMessage('Invalid license'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const artwork = await Artwork.findByPk(req.params.id);
    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Check ownership
    if (artwork.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this artwork'
      });
    }

    const { title, description, category, tags, license, isPublic } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    if (license) updateData.license = license;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    await artwork.update(updateData);

    res.json({
      success: true,
      message: 'Artwork updated successfully',
      artwork
    });

  } catch (error) {
    console.error('Update artwork error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete artwork
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id);
    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Check ownership
    if (artwork.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this artwork'
      });
    }

    // Delete associated certificates
    await Certificate.destroy({ where: { artworkId: artwork.id } });

    // Delete artwork
    await artwork.destroy();

    res.json({
      success: true,
      message: 'Artwork deleted successfully'
    });

  } catch (error) {
    console.error('Delete artwork error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search artworks
router.get('/search/public', async (req, res) => {
  try {
    const { q, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { 
      isPublic: true,
      status: 'verified'
    };

    if (category) {
      whereClause.category = category;
    }

    if (q) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { tags: { [Op.contains]: [q] } }
      ];
    }

    const { count, rows: artworks } = await Artwork.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'walletAddress']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      artworks,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Search artworks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get artwork statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await Artwork.findAll({
      where: { userId: req.user.id },
      attributes: [
        'status',
        [Artwork.sequelize.fn('COUNT', Artwork.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const totalViews = await Artwork.sum('viewCount', {
      where: { userId: req.user.id }
    });

    const totalVerifications = await Verification.sum('id', {
      include: [{
        model: Artwork,
        as: 'artwork',
        where: { userId: req.user.id }
      }]
    });

    res.json({
      success: true,
      stats: {
        byStatus: stats.reduce((acc, stat) => {
          acc[stat.status] = parseInt(stat.count);
          return acc;
        }, {}),
        totalViews: totalViews || 0,
        totalVerifications: totalVerifications || 0
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
