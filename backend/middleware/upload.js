const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure upload directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = file.fieldname === 'avatar' ? 'avatars' : 'artworks';
    const dir = path.join(uploadDir, subDir);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}_${randomString}${ext}`;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Audio
    'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg',
    // Video
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm',
    // Documents
    'application/pdf', 'text/plain', 'text/markdown',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Archives
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    // Code files
    'text/javascript', 'text/css', 'text/html', 'application/json',
    'text/x-python', 'text/x-java-source', 'text/x-c', 'text/x-c++'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024, // 100MB default
    files: 1 // Only one file per upload
  }
});

// Middleware for artwork upload
const uploadArtwork = upload.single('file');

// Middleware for avatar upload
const uploadAvatar = upload.single('avatar');

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 100MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed per upload.'
      });
    }
  }
  
  if (err.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};

// Utility function to generate file hash
const generateFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
};

// Utility function to extract file metadata
const extractFileMetadata = async (filePath, mimetype) => {
  const stats = fs.statSync(filePath);
  const metadata = {
    size: stats.size,
    mimetype: mimetype,
    createdAt: stats.birthtime,
    modifiedAt: stats.mtime
  };

  // Extract EXIF data for images
  if (mimetype.startsWith('image/')) {
    try {
      const ExifReader = require('exif-js');
      const buffer = fs.readFileSync(filePath);
      const exif = ExifReader.load(buffer);
      
      if (exif) {
        metadata.exif = {
          camera: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : null,
          dateTaken: exif.DateTimeOriginal || exif.DateTime,
          gps: exif.GPSLatitude && exif.GPSLongitude ? {
            latitude: exif.GPSLatitude,
            longitude: exif.GPSLongitude
          } : null,
          dimensions: exif.PixelXDimension && exif.PixelYDimension ? {
            width: exif.PixelXDimension,
            height: exif.PixelYDimension
          } : null
        };
      }
    } catch (error) {
      console.log('Could not extract EXIF data:', error.message);
    }
  }

  return metadata;
};

module.exports = {
  uploadArtwork,
  uploadAvatar,
  handleUploadError,
  generateFileHash,
  extractFileMetadata
};
