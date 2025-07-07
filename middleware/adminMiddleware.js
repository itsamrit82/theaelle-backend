// middleware/verifyAdmin.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyAdmin = async (req, res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid user' });
    }

    // 3. Check admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // 4. Attach user to request
    req.user = user;
    next();

  } catch (err) {
    console.error('Admin auth error:', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

export default verifyAdmin;
