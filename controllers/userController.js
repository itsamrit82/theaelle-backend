// File: controllers/userController.js

import User from '../models/User.js';
import bcrypt from 'bcrypt';

// 🟢 GET /api/users - Fetch all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't return passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching users." });
  }
};

// 🟢 GET /api/users/:id - Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user." });
  }
};

// 🟢 PUT /api/users/:id - Update user info (name, email, password)
export const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updated = await user.save();
    res.json({ message: "User updated successfully", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating user." });
  }
};

// 🟢 DELETE /api/users/:id - Delete a user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user." });
  }
};
// File: controllers/userController.js (append this function)

export const toggleWishlistItem = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.wishlist.indexOf(productId);

    if (index > -1) {
      // If product exists, remove it
      user.wishlist.splice(index, 1);
    } else {
      // Else, add it
      user.wishlist.push(productId);
    }

    await user.save();
    res.json({ wishlist: user.wishlist, message: "Wishlist updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while toggling wishlist" });
  }
};
