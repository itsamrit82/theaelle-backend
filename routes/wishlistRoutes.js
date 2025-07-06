import express from 'express';
const router = express.Router();

// GET wishlist
router.get('/', (req, res) => {
  res.json({ wishlist: [] });
});

// POST add to wishlist
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Added to wishlist' });
});

// DELETE from wishlist
router.delete('/:id', (req, res) => {
  res.json({ success: true, message: 'Removed from wishlist' });
});

export default router;