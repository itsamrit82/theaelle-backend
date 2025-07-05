import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../utils/supabaseAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JWT token generator
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Multer config for profilePic
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage }).single('profilePic');

// SEND EMAIL VERIFICATION
export const sendEmailVerification = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate verification token
    const verificationToken = jwt.sign(
      { email, purpose: 'email_verification' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create verification URL
    const verificationUrl = `https://theaelle.store/signup?token=${verificationToken}`;
    
    // Send verification email via Supabase
    const emailResult = await sendVerificationEmail(email, verificationUrl);
    
    if (emailResult.success) {
      res.json({ 
        message: 'Verification link sent to your email. Please check your inbox.',
        success: true
      });
    } else {
      // Fallback - show link in console and response
      console.log('\n=== EMAIL VERIFICATION LINK ===');
      console.log('Copy this link to verify email:');
      console.log(verificationUrl);
      console.log('===============================\n');
      
      res.json({ 
        message: 'Verification link generated. Check server console for the link.',
        verificationUrl,
        success: true
      });
    }
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
};

// VERIFY EMAIL TOKEN
export const verifyEmailToken = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.purpose !== 'email_verification') {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // Check if email still available
    const existingUser = await User.findOne({ email: decoded.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    res.json({ 
      message: 'Email verified successfully',
      email: decoded.email 
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    console.error('Token verification error:', err);
    res.status(500).json({ error: 'Failed to verify token' });
  }
};

// SIGNUP
export const signup = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'Image upload failed' });

    const { name, email, mobile, password } = req.body;
    const profilePic = req.file?.filename;

    try {
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: 'Email already exists' });

      const user = await User.create({
        name,
        email,
        mobile: mobile || '',
        password,
        profilePic
      });

      // Send welcome email
      try {
        const emailResult = await sendWelcomeEmail(email, name);
        if (emailResult.success) {
          console.log('✅ Welcome email sent to:', email);
        } else {
          console.log('⚠️ Welcome email failed:', emailResult.error);
        }
      } catch (emailError) {
        console.log('⚠️ Welcome email error:', emailError.message);
      }

      const token = generateToken(user);
      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          profilePic: user.profilePic,
          role: user.role || 'user',
        }
      });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Signup failed' });
    }
  });
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profilePic: user.profilePic,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `https://theaelle.store/reset-password?token=${resetToken}`;
    
    // Send password reset email via Supabase
    const emailResult = await sendPasswordResetEmail(email, resetUrl);
    
    if (emailResult.success) {
      console.log('✅ Password reset email sent to:', email);
      res.json({ message: 'Password reset link sent to your email.' });
    } else {
      // Fallback to console if email fails
      console.log('⚠️ Email service failed, using console fallback');
      console.log('\n=== PASSWORD RESET LINK ===');
      console.log('Copy this link to reset password:');
      console.log(resetUrl);
      console.log('===========================\n');
      
      res.json({ 
        message: 'Reset link generated. Check server console for the link.',
        resetUrl
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to generate reset link' });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ error: 'Reset token is required' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if token matches and hasn't expired
    if (user.resetToken !== token || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    console.log('Password updated successfully for:', user.email);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};