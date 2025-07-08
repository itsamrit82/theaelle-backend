import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check for Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // 4. Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // 5. Attach user to request for downstream access
    req.user = user;
    next();

  } catch (err) {
    console.error('🔐 Admin Auth Error:', err.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

export default adminMiddleware;
