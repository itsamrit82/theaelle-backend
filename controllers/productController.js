import Product from '../models/Product.js';

// CREATE
export const createProduct = async (req, res) => {
  try {
    const {
      title, description, price, category, imageUrl,
      images = [], materials = [], availableColors = [], availableSizes = []
    } = req.body;

    const product = new Product({
      title,
      description,
      price,
      category,
      imageUrl,
      images,
      materials,
      availableColors,
      availableSizes
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// GET ALL
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// GET ONE
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, price, category, imageUrl,
      images = [], materials = [], availableColors = [], availableSizes = []
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        category,
        imageUrl,
        images,
        materials,
        availableColors,
        availableSizes
      },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// SEARCH
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const products = await Product.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};
