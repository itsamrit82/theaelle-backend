import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);
