import express from 'express';
const router = express.Router();

// GET feedback
router.get('/:productId', (req, res) => {
  res.json({ feedbacks: [] });
});

// POST feedback
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Feedback added' });
});

export default router;