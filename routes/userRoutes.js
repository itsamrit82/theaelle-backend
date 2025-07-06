import express from 'express';
const router = express.Router();

// GET user profile
router.get('/profile', (req, res) => {
  res.json({ user: null });
});

export default router;