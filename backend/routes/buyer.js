const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const SupportTicket = require('../models/SupportTicket');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/orders', authenticateToken, authorizeRole('buyer'), [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { items, shippingAddress, notes } = req.body;

    // Validate products and calculate totals
    const orderItems = [];
    let totalAmount = 0;
    let sellerId = null;

    for (const item of items) {
      const product = await Product.findById(item.product).populate('seller');
      
      if (!product || !product.isActive || !product.inStock) {
        return res.status(400).json({ 
          message: `Product ${product?.name || 'Unknown'} is not available` 
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}` 
        });
      }

      // Ensure all items are from the same seller
      if (sellerId && sellerId !== product.seller._id.toString()) {
        return res.status(400).json({ 
          message: 'All items in an order must be from the same seller' 
        });
      }
      sellerId = product.seller._id.toString();

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });

      // Update product stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stockQuantity: -item.quantity },
        inStock: product.stockQuantity - item.quantity > 0
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = new Order({
      orderNumber,
      buyer: req.user._id,
      seller: sellerId,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        ...shippingAddress,
        country: shippingAddress.country || 'Sri Lanka'
      },
      notes
    });

    await order.save();
    await order.populate([
      { path: 'buyer', select: 'name email phone' },
      { path: 'seller', select: 'name email phone' },
      { path: 'items.product', select: 'name images category' }
    ]);

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Get buyer's orders
router.get('/orders', authenticateToken, authorizeRole('buyer'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { buyer: req.user._id };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate([
        { path: 'seller', select: 'name email phone' },
        { path: 'items.product', select: 'name images category price' }
      ])
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get single order
router.get('/orders/:id', authenticateToken, authorizeRole('buyer'), async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      buyer: req.user._id 
    }).populate([
      { path: 'seller', select: 'name email phone address' },
      { path: 'items.product', select: 'name images category description weight' }
    ]);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });

  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

// Cancel order (only if status is pending)
router.patch('/orders/:id/cancel', authenticateToken, authorizeRole('buyer'), async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      buyer: req.user._id 
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stockQuantity: item.quantity },
        inStock: true
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Order cancellation error:', error);
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
});

// Create support ticket
router.post('/support/tickets', authenticateToken, authorizeRole('buyer'), [
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('category').isIn(['order', 'product', 'payment', 'account', 'technical', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('relatedOrder').optional().isMongoId().withMessage('Invalid order ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { subject, description, category, priority, relatedOrder } = req.body;

    // Validate related order if provided
    if (relatedOrder) {
      const order = await Order.findOne({ _id: relatedOrder, buyer: req.user._id });
      if (!order) {
        return res.status(400).json({ message: 'Invalid or unauthorized order reference' });
      }
    }

    // Generate ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const ticket = new SupportTicket({
      ticketNumber,
      subject,
      description,
      category,
      priority: priority || 'medium',
      submittedBy: req.user._id,
      relatedOrder: relatedOrder || null,
      messages: [{
        sender: req.user._id,
        message: description,
        timestamp: new Date()
      }]
    });

    await ticket.save();
    await ticket.populate([
      { path: 'submittedBy', select: 'name email' },
      { path: 'relatedOrder', select: 'orderNumber totalAmount' }
    ]);

    res.status(201).json({
      message: 'Support ticket created successfully',
      ticket
    });

  } catch (error) {
    console.error('Ticket creation error:', error);
    res.status(500).json({ message: 'Failed to create support ticket', error: error.message });
  }
});

// Get buyer's support tickets
router.get('/support/tickets', authenticateToken, authorizeRole('buyer'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { submittedBy: req.user._id };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const tickets = await SupportTicket.find(filter)
      .populate([
        { path: 'assignedTo', select: 'name email' },
        { path: 'relatedOrder', select: 'orderNumber totalAmount' }
      ])
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await SupportTicket.countDocuments(filter);

    res.json({
      tickets,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTickets: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Tickets fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch support tickets', error: error.message });
  }
});

// Get single support ticket
router.get('/support/tickets/:id', authenticateToken, authorizeRole('buyer'), async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({ 
      _id: req.params.id, 
      submittedBy: req.user._id 
    }).populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'relatedOrder', select: 'orderNumber totalAmount items' },
      { path: 'messages.sender', select: 'name role' }
    ]);

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    res.json({ ticket });

  } catch (error) {
    console.error('Ticket fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch support ticket', error: error.message });
  }
});

// Add message to support ticket
router.post('/support/tickets/:id/messages', authenticateToken, authorizeRole('buyer'), [
  body('message').trim().isLength({ min: 1 }).withMessage('Message cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { message } = req.body;

    const ticket = await SupportTicket.findOne({ 
      _id: req.params.id, 
      submittedBy: req.user._id 
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    if (ticket.status === 'closed') {
      return res.status(400).json({ message: 'Cannot add messages to closed tickets' });
    }

    ticket.messages.push({
      sender: req.user._id,
      message,
      timestamp: new Date()
    });

    // Update ticket status if it was resolved
    if (ticket.status === 'resolved') {
      ticket.status = 'in-progress';
    }

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

module.exports = router;
