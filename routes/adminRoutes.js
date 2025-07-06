import express from 'express';
const router = express.Router();

// GET admin stats
router.get('/stats', (req, res) => {
  res.json({ 
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
});

export default router;