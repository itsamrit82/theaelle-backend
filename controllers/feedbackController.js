// /Server/controllers/feedbackController.js
import Feedback from '../models/Feedback.js';

// Create Feedback
export const createFeedback = async (req, res) => {
  try {
    const { productId, comment, rating } = req.body;
    const feedback = await Feedback.create({
      user: req.user.id,
      product: productId,
      comment,
      rating,
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// Get feedbacks for one product
export const getProductFeedbacks = async (req, res) => {
  try {
    const { id } = req.params;
    const feedbacks = await Feedback.find({ product: id }).populate('user', 'name');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};
