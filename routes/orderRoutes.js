import express from 'express';
import { 
  createOrder,
  createRazorpayOrder,
  verifyPayment,
  placeOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  getAllOrders, 
  getOrderStats,
  generateInvoice
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// User routes
router.post('/create', authMiddleware, createOrder);
router.post('/create-razorpay-order', authMiddleware, createRazorpayOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.post('/place', authMiddleware, placeOrder); // For COD orders
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/order/:id', authMiddleware, getOrderById);
router.post('/invoice/:id', authMiddleware, generateInvoice);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);
router.get('/admin/stats', authMiddleware, adminMiddleware, getOrderStats);
router.put('/admin/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
