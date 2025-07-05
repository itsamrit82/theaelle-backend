import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,              // Main image
  images: [String],              // Catalog images
  materials: [String],           // e.g., ['Cotton', 'Silk']
  availableColors: [String],     // e.g., ['Red', 'Black']
  availableSizes: [String],      // e.g., ['S', 'M', 'L']
  stock: { type: Number, default: 10 },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
