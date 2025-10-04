const { User } = require('../models');

const checkProfileComplete = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  const requiredFields = ['name', 'email'];
  const missingFields = [];

  requiredFields.forEach(field => {
    if (!req.user[field] || req.user[field].trim() === '') {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Profile incomplete. Please complete your profile first.',
      code: 'PROFILE_INCOMPLETE',
      missingFields: missingFields,
      profileUrl: '/dashboard?tab=profile'
    });
  }

  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated',
      code: 'ACCOUNT_DEACTIVATED'
    });
  }

  next();
};

const checkVerificationEligibility = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'You must be logged in to verify artwork',
      code: 'AUTH_REQUIRED',
      loginUrl: '/login'
    });
  }

  const requiredFields = ['name', 'email'];
  const missingFields = [];
  const recommendations = [];

  requiredFields.forEach(field => {
    if (!req.user[field] || req.user[field].trim() === '') {
      missingFields.push(field);
    }
  });

  if (!req.user.bio) {
    recommendations.push('bio');
  }
  if (!req.user.walletAddress) {
    recommendations.push('walletAddress');
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Profile incomplete. Please complete your profile to verify artwork.',
      code: 'PROFILE_INCOMPLETE',
      missingFields: missingFields,
      recommendations: recommendations,
      profileUrl: '/dashboard?tab=profile'
    });
  }

  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated. Contact support for assistance.',
      code: 'ACCOUNT_DEACTIVATED'
    });
  }

  req.profileWarnings = recommendations.length > 0 ? {
    message: 'Consider completing your profile for better verification experience',
    recommendations: recommendations
  } : null;

  next();
};

const getProfileCompleteness = (user) => {
  const allFields = ['name', 'email', 'bio', 'walletAddress', 'avatar', 'website'];
  const completedFields = allFields.filter(field => {
    if (field === 'socialLinks') {
      return user[field] && Object.keys(user[field]).length > 0;
    }
    return user[field] && user[field].toString().trim() !== '';
  });

  return {
    percentage: Math.round((completedFields.length / allFields.length) * 100),
    completedFields: completedFields,
    missingFields: allFields.filter(field => !completedFields.includes(field)),
    totalFields: allFields.length
  };
};

module.exports = {
  checkProfileComplete,
  checkVerificationEligibility,
  getProfileCompleteness
};
