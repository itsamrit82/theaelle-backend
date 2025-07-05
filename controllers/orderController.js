import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

export const placeOrder = async (req, res) => {
  const { 
    items, 
    shippingAddress, 
    paymentDetails, 
    totalAmount, 
    shippingCost, 
    tax, 
    finalAmount, 
    notes 
  } = req.body;
  
  try {
    // Validate required fields
    if (!items || !shippingAddress || !paymentDetails || !finalAmount) {
      return res.status(400).json({ error: 'Missing required order information' });
    }
    
    // Validate shipping address
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({ error: `${field} is required in shipping address` });
      }
    }
    
    // Validate items and check product availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.title} not found` });
      }
    }
    
    // Calculate estimated delivery (7-10 business days)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 10);
    
    const order = await Order.create({
      user: req.user._id || req.user.id,
      items,
      shippingAddress,
      paymentDetails,
      totalAmount,
      shippingCost: shippingCost || 0,
      tax: tax || 0,
      finalAmount,
      estimatedDelivery,
      notes: notes || ''
    });
    
    // Populate the order with product details
    await order.populate('items.productId');
    
    console.log(`New order placed: ${order.orderNumber} by ${req.user.email}`);
    
    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(shippingAddress.email, {
        orderNumber: order.orderNumber,
        finalAmount: order.finalAmount,
        paymentDetails: order.paymentDetails,
        items: order.items,
        estimatedDelivery: order.estimatedDelivery
      });
    } catch (emailError) {
      console.log('⚠️ Order confirmation email failed:', emailError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        finalAmount: order.finalAmount,
        orderStatus: order.orderStatus,
        estimatedDelivery: order.estimatedDelivery
      }
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id || req.user.id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id || req.user.id 
    }).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ error: 'Failed to get order details' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  
  try {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    ).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    console.log(`Order ${order.orderNumber} status updated to: ${status}`);
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Admin functions
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    
    const query = status ? { orderStatus: status } : {};
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);
    
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: 'Failed to get order statistics' });
  }
};
