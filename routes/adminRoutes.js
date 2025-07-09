// ================================
// ✅ FIXED: adminRoutes.js
// ================================
import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
import {
  adminLogin,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getRefundRequests,
  approveRefund,
  getReturns,
  approveReturn,
  getPayments,
  getDeliveries,
  updateDeliveryStatus,
  getAdminStats
} from '../controllers/adminController.js';

const router = express.Router();

// ✅ Public route: Admin Login (MUST come before middleware)
router.post('/login', adminLogin);

// ✅ All routes below are protected
router.use(adminMiddleware);

// 📦 Products
router.get('/products', getAllProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// 📦 Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// 💰 Payments
router.get('/payments', getPayments);

// 🚚 Delivery
router.get('/deliveries', getDeliveries);
router.put('/deliveries/:id', updateDeliveryStatus);

// ↩️ Returns
router.get('/returns', getReturns);
router.put('/returns/:id', approveReturn);

// 💸 Refunds
router.get('/refunds', getRefundRequests);
router.put('/refunds/:id', approveRefund);

// 📊 Dashboard Stats
router.get('/stats', getAdminStats);

export default router;
