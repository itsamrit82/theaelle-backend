import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ✅ Admin login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email });
    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized: Admin not found or invalid role' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: admin._id, name: admin.name, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error during admin login' });
  }
};

// ✅ Orders
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
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// ✅ Products
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

// ✅ Refunds
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

// ✅ Returns
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

// ✅ Payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Order.find().select('user totalAmount status paymentStatus createdAt');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// ✅ Deliveries
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
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const order = await Order.findByIdAndUpdate(req.params.id, { deliveryStatus: status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};

// ✅ Dashboard Stats (dynamic now)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    res.json({ totalUsers, totalOrders, totalRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
