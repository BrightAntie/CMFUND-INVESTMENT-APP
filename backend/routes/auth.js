const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

const router = express.Router();

// Login endpoint
router.post('/login', [
  body('identifier').notEmpty().withMessage('Member ID or email is required'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { identifier, password } = req.body;

    // Find member by csm_memberID or email
    const query = `
      SELECT id, csm_memberID, first_name, last_name, email, password_hash
      FROM Members 
      WHERE csm_memberID = $1 OR email = $1
    `;
    
    const result = await pool.query(query, [identifier]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const member = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, member.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        memberId: member.csm_memberID,
        csm_memberID: member.csm_memberID,
        id: member.id,
        email: member.email
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        member: {
          csm_memberID: member.csm_memberID,
          firstName: member.first_name,
          lastName: member.last_name,
          email: member.email
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Register endpoint (for testing)
router.post('/register', [
  body('csm_memberID').notEmpty().withMessage('Member ID is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

    const { csm_memberID, firstName, lastName, email, password, telephone } = req.body;

    // Check if member already exists
    const existingMember = await pool.query(
      'SELECT id FROM Members WHERE csm_memberID = $1 OR email = $2',
      [csm_memberID, email]
    );

    if (existingMember.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Member already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new member
    const result = await pool.query(`
      INSERT INTO Members (csm_memberID, first_name, last_name, email, telephone, password_hash, date_registered)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
      RETURNING id, csm_memberID, first_name, last_name, email
    `, [csm_memberID, firstName, lastName, email, telephone, passwordHash]);

    const newMember = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      data: {
        member: {
          id: newMember.id,
          csm_memberID: newMember.csm_memberID,
          firstName: newMember.first_name,
          lastName: newMember.last_name,
          email: newMember.email
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Get member details
    const result = await pool.query(
      'SELECT csm_memberID, first_name, last_name, email FROM Members WHERE csm_memberID = $1',
      [decoded.memberId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      data: {
        member: {
          csm_memberID: result.rows[0].csm_memberID,
          firstName: result.rows[0].first_name,
          lastName: result.rows[0].last_name,
          email: result.rows[0].email
        }
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;
