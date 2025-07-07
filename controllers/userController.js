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

// Address Management
export const addAddress = async (req, res) => {
  try {
    const { label, fullName, phone, address, city, state, zipCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id || req.user.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // If this is set as default, remove default from others
    if (isDefault) {
      user.savedAddresses.forEach(addr => addr.isDefault = false);
    }
    
    user.savedAddresses.push({
      label, fullName, phone, address, city, state, zipCode, country: country || 'India', isDefault
    });
    
    await user.save();
    res.json({ message: "Address added successfully", addresses: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ addresses: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { label, fullName, phone, address, city, state, zipCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id || req.user.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const addressIndex = user.savedAddresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) return res.status(404).json({ message: "Address not found" });
    
    // If this is set as default, remove default from others
    if (isDefault) {
      user.savedAddresses.forEach(addr => addr.isDefault = false);
    }
    
    user.savedAddresses[addressIndex] = {
      ...user.savedAddresses[addressIndex],
      label, fullName, phone, address, city, state, zipCode, country: country || 'India', isDefault
    };
    
    await user.save();
    res.json({ message: "Address updated successfully", addresses: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ message: "Error updating address" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id || req.user.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    user.savedAddresses = user.savedAddresses.filter(addr => addr._id.toString() !== addressId);
    
    await user.save();
    res.json({ message: "Address deleted successfully", addresses: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address" });
  }
};
