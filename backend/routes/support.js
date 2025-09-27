const express = require('express');
const { body, validationResult } = require('express-validator');
const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get tickets under review (not assigned to anyone)
router.get('/tickets/under-review', authenticateToken, authorizeRole('support'), async (req, res) => {
  try {
    const { page = 1, limit = 10, category, priority } = req.query;

    const filter = { 
      status: { $in: ['open', 'assigned'] },
      assignedTo: null 
    };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    const tickets = await SupportTicket.find(filter)
      .populate([
        { path: 'submittedBy', select: 'name email role' },
        { path: 'relatedOrder', select: 'orderNumber totalAmount status' }
      ])
      .sort({ priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await SupportTicket.countDocuments(filter);

    // Get summary statistics
    const stats = await SupportTicket.aggregate([
      { $match: { assignedTo: null } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    stats.forEach(stat => {
      priorityStats[stat._id] = stat.count;
    });

    res.json({
      tickets,
      stats: priorityStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTickets: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Under review tickets fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch tickets under review', error: error.message });
  }
});

// Get tickets assigned to current support agent
router.get('/tickets/assigned', authenticateToken, authorizeRole('support'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, priority } = req.query;

    const filter = { assignedTo: req.user._id };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    const tickets = await SupportTicket.find(filter)
      .populate([
        { path: 'submittedBy', select: 'name email role' },
        { path: 'relatedOrder', select: 'orderNumber totalAmount status' }
      ])
      .sort({ status: 1, priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await SupportTicket.countDocuments(filter);

    // Get summary statistics
    const stats = await SupportTicket.aggregate([
      { $match: { assignedTo: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = {
      'assigned': 0,
      'in-progress': 0,
      'resolved': 0,
      'closed': 0
    };

    stats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      tickets,
      stats: statusStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTickets: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Assigned tickets fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch assigned tickets', error: error.message });
  }
});

// Get single ticket details
router.get('/tickets/:id', authenticateToken, authorizeRole('support'), async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate([
        { path: 'submittedBy', select: 'name email phone role address' },
        { path: 'assignedTo', select: 'name email' },
        { 
          path: 'relatedOrder', 
          select: 'orderNumber totalAmount status items shippingAddress',
          populate: {
            path: 'items.product',
            select: 'name category price'
          }
        },
        { path: 'messages.sender', select: 'name role' }
      ]);

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    res.json({ ticket });

  } catch (error) {
    console.error('Ticket fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch ticket', error: error.message });
  }
});

// Assign ticket to current support agent
router.patch('/tickets/:id/assign', authenticateToken, authorizeRole('support'), async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    if (ticket.assignedTo) {
      return res.status(400).json({ message: 'Ticket is already assigned' });
    }

    if (ticket.status === 'closed') {
      return res.status(400).json({ message: 'Cannot assign closed tickets' });
    }

    ticket.assignedTo = req.user._id;
    ticket.status = 'assigned';
    
    // Add system message
    ticket.messages.push({
      sender: req.user._id,
      message: `Ticket assigned to ${req.user.name}`,
      timestamp: new Date(),
      isInternal: true
    });

    await ticket.save();
    await ticket.populate([
      { path: 'submittedBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' }
    ]);

    res.json({
      message: 'Ticket assigned successfully',
      ticket
    });

  } catch (error) {
    console.error('Ticket assignment error:', error);
    res.status(500).json({ message: 'Failed to assign ticket', error: error.message });
  }
});

// Update ticket status
router.patch('/tickets/:id/status', authenticateToken, authorizeRole('support'), [
  body('status').isIn(['assigned', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('resolution').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status, resolution } = req.body;

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    // Check if support agent is assigned or can take any ticket
    if (ticket.assignedTo && ticket.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update tickets assigned to you' });
    }

    // Auto-assign if not assigned
    if (!ticket.assignedTo) {
      ticket.assignedTo = req.user._id;
    }

    const oldStatus = ticket.status;
    ticket.status = status;

    if (status === 'resolved' && resolution) {
      ticket.resolution = resolution;
      ticket.resolvedAt = new Date();
    }

    // Add system message for status change
    const statusMessages = {
      'assigned': 'Ticket has been assigned',
      'in-progress': 'Work on ticket has started',
      'resolved': 'Ticket has been resolved',
      'closed': 'Ticket has been closed'
    };

    if (oldStatus !== status) {
      ticket.messages.push({
        sender: req.user._id,
        message: statusMessages[status] || `Status changed to ${status}`,
        timestamp: new Date(),
        isInternal: true
      });
    }

    await ticket.save();
    await ticket.populate([
      { path: 'submittedBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' }
    ]);

    res.json({
      message: 'Ticket status updated successfully',
      ticket
    });

  } catch (error) {
    console.error('Ticket status update error:', error);
    res.status(500).json({ message: 'Failed to update ticket status', error: error.message });
  }
});

// Add message to ticket
router.post('/tickets/:id/messages', authenticateToken, authorizeRole('support'), [
  body('message').trim().isLength({ min: 1 }).withMessage('Message cannot be empty'),
  body('isInternal').optional().isBoolean().withMessage('isInternal must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { message, isInternal = false } = req.body;

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    if (ticket.status === 'closed') {
      return res.status(400).json({ message: 'Cannot add messages to closed tickets' });
    }

    // Check if support agent is assigned or can take any ticket
    if (ticket.assignedTo && ticket.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only add messages to tickets assigned to you' });
    }

    // Auto-assign if not assigned
    if (!ticket.assignedTo) {
      ticket.assignedTo = req.user._id;
      ticket.status = 'assigned';
    }

    // Update status to in-progress if it was just assigned
    if (ticket.status === 'assigned') {
      ticket.status = 'in-progress';
    }

    ticket.messages.push({
      sender: req.user._id,
      message,
      timestamp: new Date(),
      isInternal
    });

    await ticket.save();
    await ticket.populate('messages.sender', 'name role');

    res.json({
      message: 'Message added successfully',
      ticket
    });

  } catch (error) {
    console.error('Message addition error:', error);
    res.status(500).json({ message: 'Failed to add message', error: error.message });
  }
});

// Get support analytics
router.get('/analytics', authenticateToken, authorizeRole('support'), async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Overall statistics
    const overallStats = await SupportTicket.aggregate([
      {
        $facet: {
          totalTickets: [{ $count: 'count' }],
          openTickets: [
            { $match: { status: { $in: ['open', 'assigned', 'in-progress'] } } },
            { $count: 'count' }
          ],
          resolvedTickets: [
            { $match: { status: 'resolved' } },
            { $count: 'count' }
          ],
          closedTickets: [
            { $match: { status: 'closed' } },
            { $count: 'count' }
          ],
          avgResolutionTime: [
            {
              $match: {
                status: { $in: ['resolved', 'closed'] },
                resolvedAt: { $exists: true }
              }
            },
            {
              $project: {
                resolutionTime: {
                  $divide: [
                    { $subtract: ['$resolvedAt', '$createdAt'] },
                    1000 * 60 * 60 * 24 // Convert to days
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                avgDays: { $avg: '$resolutionTime' }
              }
            }
          ]
        }
      }
    ]);

    // Tickets by category
    const categoryStats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Daily ticket creation trend
    const dailyStats = await SupportTicket.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          created: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Agent performance (if current user wants to see their own stats)
    const agentStats = await SupportTicket.aggregate([
      {
        $match: {
          assignedTo: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalAssigned: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $and: [{ $eq: ['$status', 'resolved'] }, { $ne: ['$resolvedAt', null] }] },
                {
                  $divide: [
                    { $subtract: ['$resolvedAt', '$createdAt'] },
                    1000 * 60 * 60 * 24
                  ]
                },
                null
              ]
            }
          }
        }
      }
    ]);

    const stats = overallStats[0];

    res.json({
      period: parseInt(period),
      overall: {
        total: stats.totalTickets[0]?.count || 0,
        open: stats.openTickets[0]?.count || 0,
        resolved: stats.resolvedTickets[0]?.count || 0,
        closed: stats.closedTickets[0]?.count || 0,
        avgResolutionTime: stats.avgResolutionTime[0]?.avgDays || 0
      },
      categories: categoryStats,
      dailyTrend: dailyStats,
      agentPerformance: agentStats[0] || { totalAssigned: 0, resolved: 0, avgResolutionTime: 0 }
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

// Get ticket categories and priorities for filters
router.get('/meta/filters', authenticateToken, authorizeRole('support'), (req, res) => {
  const categories = [
    { value: 'order', label: 'Order Issues' },
    { value: 'product', label: 'Product Issues' },
    { value: 'payment', label: 'Payment Issues' },
    { value: 'account', label: 'Account Issues' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const statuses = [
    { value: 'open', label: 'Open' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  res.json({ categories, priorities, statuses });
});

module.exports = router;
