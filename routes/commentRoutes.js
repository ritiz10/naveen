const express = require('express');
const router = express.Router();
const { addComment, getAllComments, deleteComment } = require('../controllers/commentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, addComment);

// Admin Routes
router.get('/', protect, admin, getAllComments);
router.delete('/:id', protect, admin, deleteComment);

module.exports = router;
