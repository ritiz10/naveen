const { Feedback, User, Article, Comment } = require('../models');

// Real-time Stats Helper
const emitStats = async (req) => {
    const io = req.app.get('io');
    const stats = {
        users: await User.countDocuments(),
        articles: await Article.countDocuments(),
        comments: await Comment.countDocuments(),
        feedback: await Feedback.countDocuments()
    };
    io.emit('statsUpdated', stats);
};

// @desc    Submit feedback
const submitFeedback = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        const feedback = await Feedback.create({
            name,
            email,
            message
        });

        const io = req.app.get('io');
        io.emit('newFeedback', feedback);
        emitStats(req);

        res.status(201).json(feedback);
    } catch (err) {
        res.status(500).json({ message: 'Error submitting feedback' });
    }
};

// @desc    Get all feedback (Admin)
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({}).sort('-createdAt');
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching feedback' });
    }
};

// @desc    Resolve feedback (Admin)
const resolveFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        
        feedback.status = 'resolved';
        await feedback.save();
        
        res.json({ message: 'Feedback marked as resolved' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating feedback status' });
    }
};

// @desc    Delete feedback (Admin)
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        
        emitStats(req);
        res.json({ message: 'Feedback deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting feedback' });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback,
    resolveFeedback,
    deleteFeedback
};
