import Order from '../models/Order.js';
import Product from '../models/Product.js';

// 🧾 All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.productId');
    res.json({ success: true, orders });
  } catch (err) {
    console.error('getAllOrders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// 🧾 Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// 📦 All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error('getAllProducts error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// 🛠️ Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (err) {
    console.error('updateProduct error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// 🗑️ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('deleteProduct error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// 💸 Refund Requests
export const getRefundRequests = async (req, res) => {
  try {
    const orders = await Order.find({ refundRequested: true });
    res.json({ success: true, orders });
  } catch (err) {
    console.error('getRefundRequests error:', err);
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
    res.json({ success: true, order });
  } catch (err) {
    console.error('approveRefund error:', err);
    res.status(500).json({ error: 'Failed to approve refund' });
  }
};

// ↩️ Return Requests
export const getReturns = async (req, res) => {
  try {
    const orders = await Order.find({ returnRequested: true });
    res.json({ success: true, orders });
  } catch (err) {
    console.error('getReturns error:', err);
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
    res.json({ success: true, order });
  } catch (err) {
    console.error('approveReturn error:', err);
    res.status(500).json({ error: 'Failed to approve return' });
  }
};

// 💰 Payments Overview
export const getPayments = async (req, res) => {
  try {
    const payments = await Order.find().select('user finalAmount orderStatus paymentDetails createdAt');
    res.json({ success: true, payments });
  } catch (err) {
    console.error('getPayments error:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// 🚚 Delivery Overview
export const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Order.find().select('user orderStatus deliveryStatus');
    res.json({ success: true, deliveries });
  } catch (err) {
    console.error('getDeliveries error:', err);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
};

// 🚚 Update Delivery Status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus: req.body.status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (err) {
    console.error('updateDeliveryStatus error:', err);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};

// 📊 Dashboard Stats (dummy - can replace with real queries)
export const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);
    res.json({
      success: true,
      stats: {
        totalUsers: 0, // update later
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (err) {
    console.error('getAdminStats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
