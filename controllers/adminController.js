import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// ✅ Admin Login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid credentials or not an admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      admin: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: 'admin'
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ✅ Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// ✅ Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// ✅ Get Refund Requests
export const getRefundRequests = async (req, res) => {
  try {
    const orders = await Order.find({ refundRequested: true });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch refunds' });
  }
};

// ✅ Approve Refund
export const approveRefund = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { refundApproved: true },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve refund' });
  }
};

// ✅ Get Return Requests
export const getReturns = async (req, res) => {
  try {
    const orders = await Order.find({ returnRequested: true });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch returns' });
  }
};

// ✅ Approve Return
export const approveReturn = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { returnApproved: true },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve return' });
  }
};

// ✅ Get Payments (summary)
export const getPayments = async (req, res) => {
  try {
    const payments = await Order.find().select(
      'user totalAmount finalAmount paymentDetails paymentStatus orderStatus createdAt'
    ).populate('user');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// ✅ Get Deliveries
export const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Order.find().select('user orderStatus deliveryStatus').populate('user');
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
};

// ✅ Update Delivery Status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};

// ✅ Dashboard Stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: '$finalAmount' }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
