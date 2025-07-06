import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  searchProducts
} from '../controllers/productController.js';

import Product from '../models/Product.js';

const router = express.Router();

router.get('/search', searchProducts);        // Search products
router.post('/', createProduct);              // Add new product
router.get('/', getProducts);                 // Get all
router.get('/:id', getProductById);           // Get by ID
router.put('/:id', updateProduct);            // Update product

router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting product ID:', req.params.id);
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// LATEST (for HomePage)
router.get('/latest', async (req, res) => {
  try {
    const latest = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(latest);
  } catch (err) {
    console.error('Error in /latest:', err);
    res.status(500).json({ error: 'Failed to fetch latest products' });
  }
});

export default router;
