const { Comment, Article, User, Feedback } = require('../models');

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

// @desc    Add comment to article
const addComment = async (req, res) => {
    try {
        const { content, articleId } = req.body;
        
        const comment = await Comment.create({
            content,
            article: articleId,
            user: req.user._id
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('user', 'name')
            .populate('article', 'title');

        // Real-time notification for admin
        const io = req.app.get('io');
        io.emit('newComment', populatedComment);
        emitStats(req);

        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ message: 'Error adding comment' });
    }
};

// @desc    Get all comments (Admin)
const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({})
            .populate('user', 'name email')
            .populate('article', 'title')
            .sort('-createdAt');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
};

// @desc    Delete comment (Admin)
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        emitStats(req);
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting comment' });
    }
};

module.exports = {
    addComment,
    getAllComments,
    deleteComment
};
