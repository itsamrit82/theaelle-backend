import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getRefundRequests = async (req, res) => {
  try {
    const orders = await Order.find({ refundRequested: true });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch refunds' });
  }
};

export const approveRefund = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { refundApproved: true }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve refund' });
  }
};

export const getReturns = async (req, res) => {
  try {
    const orders = await Order.find({ returnRequested: true });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch returns' });
  }
};

export const approveReturn = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { returnApproved: true }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve return' });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Order.find().select('user totalAmount status paymentStatus createdAt');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Order.find().select('user status deliveryStatus');
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { deliveryStatus: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    res.json({ totalUsers: 123, totalOrders: 56, totalRevenue: 78900 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};