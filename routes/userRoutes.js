// File: server/routes/userRoutes.js
import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleWishlistItem,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// ✅ Secure wishlist toggle with token (PATCH)
// router.patch("/wishlist",  authMiddleware, toggleWishlistItem);

export default router;
