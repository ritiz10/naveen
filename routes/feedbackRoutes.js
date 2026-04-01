const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, resolveFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', submitFeedback);

// Admin Routes
router.get('/', protect, admin, getAllFeedback);
router.put('/:id/resolve', protect, admin, resolveFeedback);
router.delete('/:id', protect, admin, deleteFeedback);

module.exports = router;
