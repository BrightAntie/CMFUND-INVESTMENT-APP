const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all dashboard routes
router.use(authMiddleware);

// Get member's dashboard summary
router.get('/:memberID', async (req, res) => {
  try {
    const { memberID } = req.params;
    
    // Verify member exists and user has access
    if (req.member.csm_memberID !== memberID) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get investment summary
    const summaryQuery = `
      SELECT 
        COALESCE(SUM(amount_invested), 0) as total_invested,
        COALESCE(SUM(gain), 0) as total_gains,
        COALESCE(SUM(current_value), 0) as current_value,
        COALESCE(SUM(qty_sold * current_price), 0) as total_sold
      FROM Investment_History 
      WHERE csm_memberID = $1
    `;

    const summaryResult = await pool.query(summaryQuery, [memberID]);
    const summary = summaryResult.rows[0];

    // Get recent transactions (last 10)
    const transactionsQuery = `
      SELECT 
        tnx_date,
        description,
        qty_bought,
        purchase_price,
        amount_invested,
        share_balance,
        current_value,
        gain,
        qty_sold,
        charges
      FROM Investment_History 
      WHERE csm_memberID = $1 
      ORDER BY tnx_date DESC 
      LIMIT 10
    `;

    const transactionsResult = await pool.query(transactionsQuery, [memberID]);

    // Get monthly performance data (last 12 months)
    const performanceQuery = `
      SELECT 
        DATE_TRUNC('month', tnx_date) as month,
        SUM(amount_invested) as invested,
        SUM(gain) as gains,
        SUM(current_value) as current_value
      FROM Investment_History 
      WHERE csm_memberID = $1 
        AND tnx_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', tnx_date)
      ORDER BY month ASC
    `;

    const performanceResult = await pool.query(performanceQuery, [memberID]);

    res.json({
      success: true,
      data: {
        summary: {
          totalInvested: parseFloat(summary.total_invested),
          totalGains: parseFloat(summary.total_gains),
          currentValue: parseFloat(summary.current_value),
          totalSold: parseFloat(summary.total_sold)
        },
        recentTransactions: transactionsResult.rows,
        performance: performanceResult.rows.map(row => ({
          month: row.month,
          invested: parseFloat(row.invested),
          gains: parseFloat(row.gains),
          currentValue: parseFloat(row.current_value)
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

// Get member's investment history
router.get('/:memberID/investments', async (req, res) => {
  try {
    const { memberID } = req.params;
    const { page = 1, limit = 20, sortBy = 'tnx_date', sortOrder = 'DESC' } = req.query;
    
    // Verify member exists and user has access
    if (req.member.csm_memberID !== memberID) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const offset = (page - 1) * limit;
    const validSortColumns = ['tnx_date', 'description', 'amount_invested', 'current_value', 'gain'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'tnx_date';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM Investment_History WHERE csm_memberID = $1';
    const countResult = await pool.query(countQuery, [memberID]);
    const totalCount = parseInt(countResult.rows[0].count);

    // Get paginated investments
    const investmentsQuery = `
      SELECT 
        id,
        tnx_date,
        description,
        qty_bought,
        purchase_price,
        amount_invested,
        share_balance,
        current_value,
        gain,
        qty_sold,
        charges,
        shareholder,
        current_price,
        created_at
      FROM Investment_History 
      WHERE csm_memberID = $1 
      ORDER BY ${sortColumn} ${order}
      LIMIT $2 OFFSET $3
    `;

    const investmentsResult = await pool.query(investmentsQuery, [memberID, limit, offset]);

    res.json({
      success: true,
      data: {
        investments: investmentsResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: offset + limit < totalCount,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investment history',
      error: error.message
    });
  }
});

// Get member's profile
router.get('/:memberID/profile', async (req, res) => {
  try {
    const { memberID } = req.params;
    
    // Verify member exists and user has access
    if (req.member.csm_memberID !== memberID) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const profileQuery = `
      SELECT 
        csm_memberID,
        first_name,
        last_name,
        email,
        telephone,
        date_registered,
        customer_number,
        created_at
      FROM Members 
      WHERE csm_memberID = $1
    `;

    const result = await pool.query(profileQuery, [memberID]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const member = result.rows[0];

    res.json({
      success: true,
      data: {
        member: {
          csm_memberID: member.csm_memberID,
          firstName: member.first_name,
          lastName: member.last_name,
          email: member.email,
          telephone: member.telephone,
          dateRegistered: member.date_registered,
          customerNumber: member.customer_number,
          createdAt: member.created_at
        }
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

module.exports = router;
