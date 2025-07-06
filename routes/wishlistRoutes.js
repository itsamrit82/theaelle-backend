import express from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getWishlist);
router.post('/toggle', authenticateToken, toggleWishlist);

export default router;