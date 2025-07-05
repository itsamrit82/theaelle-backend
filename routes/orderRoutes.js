import express from 'express';
import { 
  placeOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  getAllOrders, 
  getOrderStats 
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// User routes
router.post('/place', authMiddleware, placeOrder);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/order/:id', authMiddleware, getOrderById);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);
router.get('/admin/stats', authMiddleware, adminMiddleware, getOrderStats);
router.put('/admin/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
