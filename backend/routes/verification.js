const express = require('express');
const { body, validationResult } = require('express-validator');
const { Artwork, Verification, User } = require('../models');
const { generateFileHash } = require('../middleware/upload');
const multer = require('multer');
const { Op } = require('sequelize');

const router = express.Router();

// Configure multer for verification uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

// Verify by hash
router.get('/hash/:hash', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { hash } = req.params;
    
    if (!hash || hash.length !== 64) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hash format. Hash must be 64 characters long.'
      });
    }

    // Find artwork by hash
    const artwork = await Artwork.findOne({
      where: { fileHash: hash },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'walletAddress']
        }
      ]
    });

    if (!artwork) {
      // Record failed verification
      await Verification.create({
        artworkId: null,
        verificationType: 'hash',
        verificationData: { hash },
        isSuccessful: false,
        errorMessage: 'Hash not found',
        processingTime: Date.now() - startTime,
        verifierIp: req.ip,
        verifierUserAgent: req.get('User-Agent')
      });

      return res.status(404).json({
        success: false,
        isValid: false,
        message: 'Artwork not found with this hash'
      });
    }

    // Record successful verification
    await Verification.create({
      artworkId: artwork.id,
      verificationType: 'hash',
      verificationData: { hash },
      isSuccessful: true,
      result: {
        artworkId: artwork.id,
        title: artwork.title,
        creator: artwork.creator.name
      },
      processingTime: Date.now() - startTime,
      verifierIp: req.ip,
      verifierUserAgent: req.get('User-Agent')
    });

    // Increment verification count
    await artwork.increment('verificationCount');

    res.json({
      success: true,
      isValid: true,
      artwork: {
        id: artwork.id,
        title: artwork.title,
        description: artwork.description,
        creator: {
          name: artwork.creator.name,
          walletAddress: artwork.creator.walletAddress
        },
        fileHash: artwork.fileHash,
        createdAt: artwork.createdAt,
        status: artwork.status,
        certificateUrl: artwork.certificateUrl,
        nftTokenId: artwork.nftTokenId
      }
    });

  } catch (error) {
    console.error('Hash verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify by file upload
router.post('/file', upload.single('file'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Generate hash from uploaded file
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(req.file.buffer);
    const fileHash = hash.digest('hex');

    // Find artwork by hash
    const artwork = await Artwork.findOne({
      where: { fileHash },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'walletAddress']
        }
      ]
    });

    if (!artwork) {
      // Record failed verification
      await Verification.create({
        artworkId: null,
        verificationType: 'file',
        verificationData: { 
          fileName: req.file.originalname,
          fileSize: req.file.size,
          fileType: req.file.mimetype,
          generatedHash: fileHash
        },
        isSuccessful: false,
        errorMessage: 'File not found in database',
        processingTime: Date.now() - startTime,
        verifierIp: req.ip,
        verifierUserAgent: req.get('User-Agent')
      });

      return res.status(404).json({
        success: false,
        isValid: false,
        message: 'File not found in our database. This artwork may not be registered.'
      });
    }

    // Record successful verification
    await Verification.create({
      artworkId: artwork.id,
      verificationType: 'file',
      verificationData: { 
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        generatedHash: fileHash
      },
      isSuccessful: true,
      result: {
        artworkId: artwork.id,
        title: artwork.title,
        creator: artwork.creator.name
      },
      processingTime: Date.now() - startTime,
      verifierIp: req.ip,
      verifierUserAgent: req.get('User-Agent')
    });

    // Increment verification count
    await artwork.increment('verificationCount');

    res.json({
      success: true,
      isValid: true,
      artwork: {
        id: artwork.id,
        title: artwork.title,
        description: artwork.description,
        creator: {
          name: artwork.creator.name,
          walletAddress: artwork.creator.walletAddress
        },
        fileHash: artwork.fileHash,
        createdAt: artwork.createdAt,
        status: artwork.status,
        certificateUrl: artwork.certificateUrl,
        nftTokenId: artwork.nftTokenId
      }
    });

  } catch (error) {
    console.error('File verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify by QR code
router.post('/qr', [
  body('qrData').notEmpty().withMessage('QR code data is required')
], async (req, res) => {
  const startTime = Date.now();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { qrData } = req.body;

    // Parse QR data (assuming it contains artwork ID or hash)
    let artwork;
    
    try {
      // Try to parse as JSON first
      const qrInfo = JSON.parse(qrData);
      
      if (qrInfo.artworkId) {
        artwork = await Artwork.findByPk(qrInfo.artworkId, {
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name', 'walletAddress']
            }
          ]
        });
      } else if (qrInfo.hash) {
        artwork = await Artwork.findOne({
          where: { fileHash: qrInfo.hash },
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name', 'walletAddress']
            }
          ]
        });
      }
    } catch (parseError) {
      // If not JSON, treat as direct hash
      if (qrData.length === 64) {
        artwork = await Artwork.findOne({
          where: { fileHash: qrData },
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name', 'walletAddress']
            }
          ]
        });
      }
    }

    if (!artwork) {
      // Record failed verification
      await Verification.create({
        artworkId: null,
        verificationType: 'qr',
        verificationData: { qrData },
        isSuccessful: false,
        errorMessage: 'QR code data not found',
        processingTime: Date.now() - startTime,
        verifierIp: req.ip,
        verifierUserAgent: req.get('User-Agent')
      });

      return res.status(404).json({
        success: false,
        isValid: false,
        message: 'Invalid QR code. Artwork not found.'
      });
    }

    // Record successful verification
    await Verification.create({
      artworkId: artwork.id,
      verificationType: 'qr',
      verificationData: { qrData },
      isSuccessful: true,
      result: {
        artworkId: artwork.id,
        title: artwork.title,
        creator: artwork.creator.name
      },
      processingTime: Date.now() - startTime,
      verifierIp: req.ip,
      verifierUserAgent: req.get('User-Agent')
    });

    // Increment verification count
    await artwork.increment('verificationCount');

    res.json({
      success: true,
      isValid: true,
      artwork: {
        id: artwork.id,
        title: artwork.title,
        description: artwork.description,
        creator: {
          name: artwork.creator.name,
          walletAddress: artwork.creator.walletAddress
        },
        fileHash: artwork.fileHash,
        createdAt: artwork.createdAt,
        status: artwork.status,
        certificateUrl: artwork.certificateUrl,
        nftTokenId: artwork.nftTokenId
      }
    });

  } catch (error) {
    console.error('QR verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get verification statistics
router.get('/stats', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const stats = await Verification.findAll({
      where: {
        createdAt: {
          [Op.gte]: dateFilter
        }
      },
      attributes: [
        'verificationType',
        'isSuccessful',
        [Verification.sequelize.fn('COUNT', Verification.sequelize.col('id')), 'count']
      ],
      group: ['verificationType', 'isSuccessful'],
      raw: true
    });

    const totalVerifications = await Verification.count({
      where: {
        createdAt: {
          [Op.gte]: dateFilter
        }
      }
    });

    const successfulVerifications = await Verification.count({
      where: {
        createdAt: {
          [Op.gte]: dateFilter
        },
        isSuccessful: true
      }
    });

    res.json({
      success: true,
      stats: {
        total: totalVerifications,
        successful: successfulVerifications,
        failed: totalVerifications - successfulVerifications,
        byType: stats.reduce((acc, stat) => {
          if (!acc[stat.verificationType]) {
            acc[stat.verificationType] = { successful: 0, failed: 0 };
          }
          acc[stat.verificationType][stat.isSuccessful ? 'successful' : 'failed'] = parseInt(stat.count);
          return acc;
        }, {}),
        period
      }
    });

  } catch (error) {
    console.error('Get verification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get recent verifications
router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const verifications = await Verification.findAll({
      where: { isSuccessful: true },
      include: [
        {
          model: Artwork,
          as: 'artwork',
          attributes: ['id', 'title', 'fileHash'],
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['name']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      verifications: verifications.map(v => ({
        id: v.id,
        type: v.verificationType,
        createdAt: v.createdAt,
        artwork: v.artwork ? {
          id: v.artwork.id,
          title: v.artwork.title,
          creator: v.artwork.creator.name
        } : null
      }))
    });

  } catch (error) {
    console.error('Get recent verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
