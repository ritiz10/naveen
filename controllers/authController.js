const { User, Article, Comment, Feedback } = require('../models');
const jwt = require('jsonwebtoken');

// Enhanced Token Generator
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

// Centralized Cookie Manager
const setTokenCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    };
    res.cookie('token', token, cookieOptions);
};

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

// @desc    Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profile_id, department } = req.body;

        if (!name || !email || !password || !profile_id || !department) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const userExists = await User.findOne({ 
            $or: [{ email }, { profile_id }] 
        });

        if (userExists) {
            return res.status(400).json({ 
                message: userExists.email === email 
                    ? 'Email already registered.' 
                    : 'Roll Number/Profile ID already in use.' 
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            profile_id,
            department
        });

        if (user) {
            const token = generateToken(user._id);
            setTokenCookie(res, token);
            
            // Real-time update
            emitStats(req);

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_id: user.profile_id,
                department: user.department
            });
        }
    } catch (err) {
        console.error('Signup Error:', err);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
};

// @desc    Authenticate a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            if (user.isBlocked) {
                return res.status(403).json({ message: 'Your account has been blocked by admin.' });
            }

            const token = generateToken(user._id);
            setTokenCookie(res, token);
            
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_id: user.profile_id,
                department: user.department
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ message: 'Server error during login.' });
    }
};

// @desc    Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort('-createdAt');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// @desc    Toggle block user (Admin only)
const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user status' });
    }
};

// Other methods...
const getMe = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(req.user);
};

const logoutUser = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0), path: '/' });
    return res.status(200).json({ success: true });
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    toggleBlockUser,
    getMe,
    logoutUser
};

