import { SupabaseUser } from '../models/SupabaseUser.js';
import { supabase } from '../utils/supabaseConfig.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Check if user exists
    const existingUser = await SupabaseUser.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Create user
    const user = await SupabaseUser.create({
      name,
      email,
      mobile,
      password,
      profilePic: req.file?.filename
    });
    
    // Send welcome email via Supabase
    try {
      await supabase.auth.admin.inviteUserByEmail(email, {
        data: { name, welcome: true },
        redirectTo: `${process.env.CLIENT_URL}/login`
      });
      console.log('✅ Welcome email sent to:', email);
    } catch (emailError) {
      console.log('⚠️ Email failed:', emailError.message);
    }
    
    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await SupabaseUser.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await SupabaseUser.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await SupabaseUser.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }
    
    // Send reset email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`
    });
    
    if (error) {
      console.log('Reset email failed:', error.message);
      return res.status(500).json({ error: 'Failed to send reset email' });
    }
    
    console.log('✅ Password reset email sent to:', email);
    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await SupabaseUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};