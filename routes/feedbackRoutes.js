import express from 'express';
import { createFeedback, getProductFeedbacks } from '../controllers/feedbackController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:productId', authMiddleware, createFeedback);
router.get('/:productId', getProductFeedbacks);

export default router;
