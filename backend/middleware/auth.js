const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Attach user object based on role
    if (decoded.role === 'candidate') {
      req.candidate = await Candidate.findById(decoded.id);
    } else if (decoded.role === 'company') {
      req.company = await Company.findById(decoded.id);
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

const candidateOnly = (req, res, next) => {
  if (req.user && req.user.role === 'candidate') return next();
  res.status(403).json({ success: false, message: 'Access denied: candidates only' });
};

const companyOnly = (req, res, next) => {
  if (req.user && req.user.role === 'company') return next();
  res.status(403).json({ success: false, message: 'Access denied: companies only' });
};

module.exports = { protect, candidateOnly, companyOnly };
