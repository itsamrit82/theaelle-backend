import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail, sendInvoiceEmail } from '../services/emailService.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

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

export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentDetails, totalAmount, shippingCost, tax, finalAmount, notes } = req.body;
  try {
    if (!items || !shippingAddress || !paymentDetails || !finalAmount) {
      return res.status(400).json({ error: 'Missing required order information' });
    }
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({ error: `${field} is required in shipping address` });
      }
    }
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.title} not found` });
      }
    }
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 10);
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
      orderStatus: 'pending'
    });
    console.log(`Order created (pending payment): ${order.orderNumber} by ${req.user.email}`);
    res.status(201).json({ success: true, message: 'Order created, awaiting payment confirmation', order: { _id: order._id, orderNumber: order.orderNumber, finalAmount: order.finalAmount, orderStatus: order.orderStatus, paymentStatus: order.paymentDetails.paymentStatus } });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const createRazorpayOrder = async (req, res) => {
  const { amount, orderId } = req.body;
  try {
    if (!razorpay) {
      return res.status(500).json({ error: 'Razorpay not initialized' });
    }
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `order_${orderId}`,
      payment_capture: 1
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ success: true, id: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};
export const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id || req.user.id 
    }).populate('items.productId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await sendInvoiceEmail(order.shippingAddress.email, order);

    res.json({
      success: true,
      message: 'Invoice sent to your email'
    });

  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
};

export const verifyPayment = async (req, res) => {
  const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  try {
    const order = await Order.findById(orderId).populate('items.productId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay configuration missing' });
    }
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
    if (expectedSignature !== razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { 'paymentDetails.paymentStatus': 'failed', orderStatus: 'cancelled' });
      return res.status(400).json({ error: 'Payment verification failed' });
    }
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { 'paymentDetails.paymentStatus': 'completed', 'paymentDetails.transactionId': razorpay_payment_id, orderStatus: 'confirmed' }, { new: true }).populate('items.productId');
    console.log(`Payment verified and order confirmed: ${updatedOrder.orderNumber}`);
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
    res.json({ success: true, message: 'Payment verified and order confirmed', order: { _id: updatedOrder._id, orderNumber: updatedOrder.orderNumber, orderStatus: updatedOrder.orderStatus, paymentStatus: updatedOrder.paymentDetails.paymentStatus } });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};
