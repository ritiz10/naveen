const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    getAllUsers,
    toggleBlockUser
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

// Admin Routes
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/block', protect, admin, toggleBlockUser);

module.exports = router;
