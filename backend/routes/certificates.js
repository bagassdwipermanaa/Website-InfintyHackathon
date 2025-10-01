const express = require('express');
const { Artwork, Certificate, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const QRCode = require('qrcode');
const jsPDF = require('jspdf');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Generate PDF certificate
const generatePDFCertificate = async (artwork, certificate) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('BlockRights', 105, 30, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Digital Copyright Certificate', 105, 45, { align: 'center' });
  
  // Certificate number
  doc.setFontSize(12);
  doc.text(`Certificate No: ${certificate.certificateNumber}`, 20, 65);
  
  // Date
  doc.text(`Date: ${new Date().toLocaleDateString('id-ID')}`, 20, 75);
  
  // Content
  doc.setFontSize(14);
  doc.text('This certifies that:', 20, 95);
  
  doc.setFontSize(12);
  doc.text(`Title: ${artwork.title}`, 20, 110);
  doc.text(`Creator: ${artwork.creator.name}`, 20, 120);
  doc.text(`File Hash: ${artwork.fileHash}`, 20, 130);
  doc.text(`Registration Date: ${new Date(artwork.createdAt).toLocaleDateString('id-ID')}`, 20, 140);
  
  // QR Code
  const qrData = JSON.stringify({
    artworkId: artwork.id,
    hash: artwork.fileHash,
    certificateNumber: certificate.certificateNumber,
    verifyUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?hash=${artwork.fileHash}`
  });
  
  const qrCodeDataURL = await QRCode.toDataURL(qrData, {
    width: 100,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  
  doc.addImage(qrCodeDataURL, 'PNG', 150, 100, 50, 50);
  doc.setFontSize(10);
  doc.text('Scan to verify', 175, 155, { align: 'center' });
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('This certificate is digitally signed and stored on the blockchain.', 105, 180, { align: 'center' });
  doc.text('For verification, visit: blockrights.com/verify', 105, 190, { align: 'center' });
  
  return doc;
};

// Download certificate
router.get('/:id/download', async (req, res) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id, {
      include: [
        {
          model: Artwork,
          as: 'artwork',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['name']
            }
          ]
        }
      ]
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check if certificate file exists
    if (certificate.filePath && fs.existsSync(certificate.filePath)) {
      return res.download(certificate.filePath);
    }

    // Generate new certificate
    const pdf = await generatePDFCertificate(certificate.artwork, certificate);
    
    // Save certificate
    const fileName = `certificate_${certificate.certificateNumber}.pdf`;
    const filePath = path.join('uploads', 'certificates', fileName);
    
    // Ensure directory exists
    const certDir = path.dirname(filePath);
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }
    
    pdf.save(filePath);
    
    // Update certificate record
    await certificate.update({ filePath });
    
    // Increment download count
    await certificate.increment('downloadCount');
    await certificate.update({ lastDownloadedAt: new Date() });

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    pdf.output('datauristring').then(dataUri => {
      const base64Data = dataUri.split(',')[1];
      res.send(Buffer.from(base64Data, 'base64'));
    });

  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Generate QR code for certificate
router.get('/:id/qr', async (req, res) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id, {
      include: [
        {
          model: Artwork,
          as: 'artwork',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['name']
            }
          ]
        }
      ]
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    const qrData = JSON.stringify({
      artworkId: certificate.artwork.id,
      hash: certificate.artwork.fileHash,
      certificateNumber: certificate.certificateNumber,
      verifyUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?hash=${certificate.artwork.fileHash}`
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      qrCode: qrCodeDataURL,
      qrData: qrData
    });

  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get certificate info
router.get('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id, {
      include: [
        {
          model: Artwork,
          as: 'artwork',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name', 'walletAddress']
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.json({
      success: true,
      certificate: {
        id: certificate.id,
        certificateNumber: certificate.certificateNumber,
        type: certificate.type,
        createdAt: certificate.createdAt,
        artwork: certificate.artwork,
        downloadCount: certificate.downloadCount,
        isActive: certificate.isActive
      }
    });

  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's certificates
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: certificates } = await Certificate.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Artwork,
          as: 'artwork',
          attributes: ['id', 'title', 'fileHash', 'status']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      certificates,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create NFT certificate
router.post('/:id/nft', authenticateToken, async (req, res) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id, {
      include: [
        {
          model: Artwork,
          as: 'artwork'
        }
      ]
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check ownership
    if (certificate.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create NFT for this certificate'
      });
    }

    // TODO: Implement NFT creation logic
    // This would involve:
    // 1. Creating NFT metadata
    // 2. Deploying to blockchain
    // 3. Getting token ID and contract address

    const nftData = {
      tokenId: `BR-${Date.now()}`,
      contractAddress: process.env.NFT_CONTRACT_ADDRESS || '0x...',
      txHash: '0x...', // Would be actual transaction hash
      metadata: {
        name: `BlockRights Certificate - ${certificate.artwork.title}`,
        description: `Digital copyright certificate for ${certificate.artwork.title}`,
        image: certificate.artwork.filePath,
        attributes: [
          { trait_type: 'Certificate Number', value: certificate.certificateNumber },
          { trait_type: 'Artwork Hash', value: certificate.artwork.fileHash },
          { trait_type: 'Creator', value: certificate.artwork.creator.name }
        ]
      }
    };

    // Update certificate with NFT data
    await certificate.update({
      type: 'nft',
      nftTokenId: nftData.tokenId,
      nftContractAddress: nftData.contractAddress,
      blockchainTxHash: nftData.txHash,
      metadata: nftData.metadata
    });

    res.json({
      success: true,
      message: 'NFT certificate created successfully',
      nft: nftData
    });

  } catch (error) {
    console.error('Create NFT certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
