const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
        trim: true,
        maxlength: [255, 'Title cannot be more than 255 characters'],
    },
    content: {
        type: String,
        required: [true, 'Please add some content'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['placements', 'events', 'departments', 'exams', 'sports', 'technology'],
    },
    image_url: {
        type: String,
        default: 'https://images.unsplash.com/photo-1585829365234-78ef2757c818?auto=format&fit=crop&q=80&w=1200',
    },
    views: {
        type: Number,
        default: 0,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Article', articleSchema);

