const express = require('express');
const { body, validationResult } = require('express-validator');
const { Dispute, Artwork, User } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Create dispute
router.post('/', authenticateToken, [
  body('artworkId').isUUID().withMessage('Valid artwork ID required'),
  body('reason').trim().isLength({ min: 10, max: 1000 }).withMessage('Reason must be between 10 and 1000 characters'),
  body('evidence').optional().isArray().withMessage('Evidence must be an array')
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

    const { artworkId, reason, evidence = [] } = req.body;

    // Check if artwork exists
    const artwork = await Artwork.findByPk(artworkId);
    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Check if user is not the creator of the artwork
    if (artwork.userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot dispute your own artwork'
      });
    }

    // Check if dispute already exists for this artwork by this user
    const existingDispute = await Dispute.findOne({
      where: {
        artworkId,
        claimantId: req.user.id,
        status: { [Op.in]: ['open', 'under-review'] }
      }
    });

    if (existingDispute) {
      return res.status(409).json({
        success: false,
        message: 'You already have an open dispute for this artwork'
      });
    }

    // Create dispute
    const dispute = await Dispute.create({
      artworkId,
      claimantId: req.user.id,
      reason,
      evidence,
      status: 'open',
      priority: 'medium'
    });

    // Update artwork status to disputed
    await artwork.update({ status: 'disputed' });

    res.status(201).json({
      success: true,
      message: 'Dispute created successfully',
      dispute
    });

  } catch (error) {
    console.error('Create dispute error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get disputes (admin only)
router.get('/', authenticateToken, requireRole(['admin', 'moderator']), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;

    const { count, rows: disputes } = await Dispute.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Artwork,
          as: 'artwork',
          attributes: ['id', 'title', 'fileHash', 'createdAt'],
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'claimant',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedTo',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: User,
          as: 'resolvedBy',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      disputes,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get disputes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's disputes
router.get('/my-disputes', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: disputes } = await Dispute.findAndCountAll({
      where: { claimantId: req.user.id },
      include: [
        {
          model: Artwork,
          as: 'artwork',
          attributes: ['id', 'title', 'fileHash', 'createdAt'],
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: User,
          as: 'assignedTo',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: User,
          as: 'resolvedBy',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      disputes,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get user disputes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get dispute by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const dispute = await Dispute.findByPk(req.params.id, {
      include: [
        {
          model: Artwork,
          as: 'artwork',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name', 'email', 'walletAddress']
            }
          ]
        },
        {
          model: User,
          as: 'claimant',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedTo',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: User,
          as: 'resolvedBy',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found'
      });
    }

    // Check if user has access to this dispute
    const hasAccess = req.user.role === 'admin' || 
                     req.user.role === 'moderator' || 
                     dispute.claimantId === req.user.id ||
                     dispute.artwork.userId === req.user.id;

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this dispute'
      });
    }

    res.json({
      success: true,
      dispute
    });

  } catch (error) {
    console.error('Get dispute error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update dispute status (admin/moderator only)
router.put('/:id/status', authenticateToken, requireRole(['admin', 'moderator']), [
  body('status').isIn(['open', 'under-review', 'resolved', 'rejected']).withMessage('Invalid status'),
  body('resolution').optional().trim().isLength({ max: 1000 }).withMessage('Resolution must be less than 1000 characters'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
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

    const dispute = await Dispute.findByPk(req.params.id);
    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found'
      });
    }

    const { status, resolution, notes } = req.body;
    const updateData = { status };

    if (resolution) updateData.resolution = resolution;
    if (notes) updateData.notes = notes;

    // If resolving, set resolved by and timestamp
    if (status === 'resolved' || status === 'rejected') {
      updateData.resolvedBy = req.user.id;
      updateData.resolvedAt = new Date();
    }

    await dispute.update(updateData);

    // Update artwork status based on dispute resolution
    if (status === 'resolved') {
      await dispute.artwork.update({ status: 'verified' });
    } else if (status === 'rejected') {
      await dispute.artwork.update({ status: 'verified' });
    }

    res.json({
      success: true,
      message: 'Dispute status updated successfully',
      dispute
    });

  } catch (error) {
    console.error('Update dispute status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Assign dispute (admin/moderator only)
router.put('/:id/assign', authenticateToken, requireRole(['admin', 'moderator']), [
  body('assignedTo').isUUID().withMessage('Valid user ID required')
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

    const dispute = await Dispute.findByPk(req.params.id);
    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found'
      });
    }

    const { assignedTo } = req.body;

    // Check if assigned user exists and has appropriate role
    const assignedUser = await User.findByPk(assignedTo);
    if (!assignedUser || !['admin', 'moderator'].includes(assignedUser.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user for assignment'
      });
    }

    await dispute.update({ 
      assignedTo,
      status: 'under-review'
    });

    res.json({
      success: true,
      message: 'Dispute assigned successfully',
      dispute
    });

  } catch (error) {
    console.error('Assign dispute error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add evidence to dispute
router.put('/:id/evidence', authenticateToken, [
  body('evidence').isArray().withMessage('Evidence must be an array'),
  body('evidence.*.type').isIn(['file', 'url', 'text']).withMessage('Invalid evidence type'),
  body('evidence.*.data').notEmpty().withMessage('Evidence data is required')
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

    const dispute = await Dispute.findByPk(req.params.id);
    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found'
      });
    }

    // Check if user is the claimant
    if (dispute.claimantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add evidence to this dispute'
      });
    }

    // Check if dispute is still open
    if (!['open', 'under-review'].includes(dispute.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add evidence to closed dispute'
      });
    }

    const { evidence } = req.body;
    const currentEvidence = dispute.evidence || [];
    const updatedEvidence = [...currentEvidence, ...evidence];

    await dispute.update({ evidence: updatedEvidence });

    res.json({
      success: true,
      message: 'Evidence added successfully',
      dispute
    });

  } catch (error) {
    console.error('Add evidence error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get dispute statistics
router.get('/stats/overview', authenticateToken, requireRole(['admin', 'moderator']), async (req, res) => {
  try {
    const stats = await Dispute.findAll({
      attributes: [
        'status',
        [Dispute.sequelize.fn('COUNT', Dispute.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const priorityStats = await Dispute.findAll({
      attributes: [
        'priority',
        [Dispute.sequelize.fn('COUNT', Dispute.sequelize.col('id')), 'count']
      ],
      group: ['priority'],
      raw: true
    });

    const totalDisputes = await Dispute.count();
    const openDisputes = await Dispute.count({ where: { status: 'open' } });
    const underReviewDisputes = await Dispute.count({ where: { status: 'under-review' } });

    res.json({
      success: true,
      stats: {
        total: totalDisputes,
        open: openDisputes,
        underReview: underReviewDisputes,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat.status] = parseInt(stat.count);
          return acc;
        }, {}),
        byPriority: priorityStats.reduce((acc, stat) => {
          acc[stat.priority] = parseInt(stat.count);
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Get dispute stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
