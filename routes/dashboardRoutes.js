import express from 'express';
const router = express.Router();

// GET dashboard stats
router.get('/stats', (req, res) => {
  res.json({ 
    products: 0, 
    users: 0, 
    orders: 0, 
    revenue: 0 
  });
});

export default router;