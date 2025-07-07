import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const users = await User.countDocuments({});
    const orders = await Order.find({});
    const revenue = orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);

    res.json({
      totalUsers: users,
      totalOrders: orders.length,
      totalRevenue: revenue
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
