import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail, sendInvoiceEmail } from '../services/emailService.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  } else {
    console.warn('Razorpay keys not found in environment variables');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message);
}

// Create order (without confirming payment)
export const createOrder = async (req, res) => {
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
    
    // Create order with pending payment status
    const order = await Order.create({
      user: req.user._id || req.user.id,
      items,
      shippingAddress,
      paymentDetails: {
        ...paymentDetails,
        paymentStatus: 'pending'
      },
      totalAmount,
      shippingCost: shippingCost || 0,
      tax: tax || 0,
      finalAmount,
      estimatedDelivery,
      notes: notes || '',
      orderStatus: 'pending' // Order stays pending until payment is confirmed
    });
    
    console.log(`Order created (pending payment): ${order.orderNumber} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      message: 'Order created, awaiting payment confirmation',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        finalAmount: order.finalAmount,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentDetails.paymentStatus
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  const { amount, orderId } = req.body;
  
  try {
    if (!razorpay) {
      return res.status(500).json({ error: 'Razorpay not initialized' });
    }
    
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      payment_capture: 1
    };
    
    const razorpayOrder = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};

// Verify payment and confirm order
export const verifyPayment = async (req, res) => {
  const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
  try {
    // Find the order
    const order = await Order.findById(orderId).populate('items.productId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Verify Razorpay signature
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay configuration missing' });
    }
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
      // Payment verification failed
      await Order.findByIdAndUpdate(orderId, {
        'paymentDetails.paymentStatus': 'failed',
        orderStatus: 'cancelled'
      });
      return res.status(400).json({ error: 'Payment verification failed' });
    }
    
    // Payment verified successfully - confirm order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        'paymentDetails.paymentStatus': 'completed',
        'paymentDetails.transactionId': razorpay_payment_id,
        orderStatus: 'confirmed'
      },
      { new: true }
    ).populate('items.productId');
    
    console.log(`Payment verified and order confirmed: ${updatedOrder.orderNumber}`);
    
    // Send order confirmation and invoice emails
    try {
      await sendOrderConfirmationEmail(updatedOrder.shippingAddress.email, {
        orderNumber: updatedOrder.orderNumber,
        finalAmount: updatedOrder.finalAmount,
        paymentDetails: updatedOrder.paymentDetails,
        items: updatedOrder.items,
        estimatedDelivery: updatedOrder.estimatedDelivery,
        shippingAddress: updatedOrder.shippingAddress
      });
      
      await sendInvoiceEmail(updatedOrder.shippingAddress.email, updatedOrder);
    } catch (emailError) {
      console.log('⚠️ Email sending failed:', emailError.message);
    }
    
    res.json({
      success: true,
      message: 'Payment verified and order confirmed',
      order: {
        _id: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        orderStatus: updatedOrder.orderStatus,
        paymentStatus: updatedOrder.paymentDetails.paymentStatus
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// Legacy function for COD orders
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
    // Only for COD orders - online payments should use createOrder + verifyPayment
    if (paymentDetails.method !== 'cod') {
      return res.status(400).json({ error: 'Use createOrder and verifyPayment for online payments' });
    }
    
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
      paymentDetails: {
        ...paymentDetails,
        paymentStatus: 'pending' // COD is pending until delivery
      },
      totalAmount,
      shippingCost: shippingCost || 0,
      tax: tax || 0,
      finalAmount,
      estimatedDelivery,
      notes: notes || '',
      orderStatus: 'confirmed' // COD orders are confirmed immediately
    });
    
    // Populate the order with product details
    await order.populate('items.productId');
    
    console.log(`COD order placed: ${order.orderNumber} by ${req.user.email}`);
    
    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(shippingAddress.email, {
        orderNumber: order.orderNumber,
        finalAmount: order.finalAmount,
        paymentDetails: order.paymentDetails,
        items: order.items,
        estimatedDelivery: order.estimatedDelivery,
        shippingAddress: order.shippingAddress
      });
    } catch (emailError) {
      console.log('⚠️ Order confirmation email failed:', emailError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'COD order placed successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        finalAmount: order.finalAmount,
        orderStatus: order.orderStatus,
        estimatedDelivery: order.estimatedDelivery
      }
    });
  } catch (error) {
    console.error('Place COD order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      user: req.user._id || req.user.id,
      orderStatus: { $ne: 'pending' } // Only show confirmed orders
    })
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

// Generate and send invoice
export const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id || req.user.id 
    }).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Send invoice email
    try {
      await sendInvoiceEmail(order.shippingAddress.email, order);
      res.json({
        success: true,
        message: 'Invoice sent to your email'
      });
    } catch (emailError) {
      console.error('Invoice email error:', emailError);
      res.status(500).json({ error: 'Failed to send invoice' });
    }
  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
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
