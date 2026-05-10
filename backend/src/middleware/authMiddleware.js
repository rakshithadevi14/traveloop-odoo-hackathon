const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    const error = new Error('Not authorized: token missing');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error('Not authorized: invalid or expired token');
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    const error = new Error('Not authorized: user no longer exists');
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    const error = new Error('Forbidden: admin access required');
    error.statusCode = 403;
    return next(error);
  }

  return next();
};

module.exports = {
  protect,
  adminOnly,
};
