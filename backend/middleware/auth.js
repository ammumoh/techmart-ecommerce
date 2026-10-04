const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function protect(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  if (!token || !process.env.JWT_SECRET) return res.status(401).json({ message: 'Authentication required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.userId).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Account not found' });
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json({ message: 'Admin access required' });
  next();
}

module.exports = { protect, adminOnly };
