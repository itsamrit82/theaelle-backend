// File: Server/routes/authRoutes.js
import express from 'express';
import { signup, login, getMe, forgotPassword, resetPassword, sendEmailVerification, verifyEmailToken, changePassword, checkEmailExists } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-verification', sendEmailVerification);
router.post('/verify-email', verifyEmailToken);
router.post('/change-password', authMiddleware, changePassword);
router.post('/check-email', checkEmailExists); 

export default router;
