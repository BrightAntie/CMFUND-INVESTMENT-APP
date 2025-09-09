const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Get member details from database
    const memberId = decoded.memberId || decoded.csm_memberID;
    const result = await pool.query(
      'SELECT csm_memberID, first_name, last_name, email FROM Members WHERE csm_memberID = $1',
      [memberId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - member not found'
      });
    }

    // Add member info to request object
    req.member = {
      csm_memberID: result.rows[0].csm_memberID,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      email: result.rows[0].email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = authMiddleware;
