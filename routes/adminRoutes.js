// File: Server/routes/adminRoutes.js
import express from 'express';
import {
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
  updateDeliveryStatus
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAdminStats } from '../controllers/adminController.js'; 

const router = express.Router();

router.get('/stats', getAdminStats); 

router.use(authMiddleware); // Protect all admin routes

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/products', getAllProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/refunds', getRefundRequests);
router.put('/refunds/:id/approve', approveRefund);

router.get('/returns', getReturns);
router.put('/returns/:id/approve', approveReturn);

router.get('/payments', getPayments);

router.get('/deliveries', getDeliveries);
router.put('/deliveries/:id/status', updateDeliveryStatus);

export default router;
