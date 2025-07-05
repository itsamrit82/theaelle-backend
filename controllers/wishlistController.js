import User from '../models/User.js';
import Product from '../models/Product.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add/Remove item from wishlist
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const isInWishlist = user.wishlist.includes(productId);

    if (isInWishlist) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
      await user.save();
      res.json({ message: 'Removed from wishlist', inWishlist: false });
    } else {
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: 'Added to wishlist', inWishlist: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};