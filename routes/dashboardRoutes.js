import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

// GET dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);
    
    const revenue = revenueResult[0]?.total || 0;
    
    res.json({ 
      products, 
      users, 
      orders, 
      revenue 
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.json({ 
      products: 0, 
      users: 0, 
      orders: 0, 
      revenue: 0 
    });
  }
});

export default router;