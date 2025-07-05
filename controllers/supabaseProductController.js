import { SupabaseProduct } from '../models/SupabaseProduct.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await SupabaseProduct.findAll();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await SupabaseProduct.findById(req.params.id);
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Product not found' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = {
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      imageUrl: req.body.imageUrl,
      images: req.body.imageCatalog ? req.body.imageCatalog.split(',').map(url => url.trim()) : [],
      materials: req.body.materials ? req.body.materials.split(',').map(m => m.trim()) : [],
      availableColors: req.body.availableColors ? req.body.availableColors.split(',').map(c => c.trim()) : [],
      availableSizes: req.body.availableSizes || []
    };
    
    const product = await SupabaseProduct.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await SupabaseProduct.update(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await SupabaseProduct.delete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await SupabaseProduct.search(q);
    res.json(products);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};