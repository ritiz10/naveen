require('dotenv').config();
const { connectDB } = require('./config/db');
const { User, Article, Comment, Feedback } = require('./models');

const viewData = async () => {
    try {
        await connectDB();
        
        console.log('\n--- 👥 USERS ---');
        const users = await User.find({}, 'name email role isBlocked');
        console.table(users.map(u => ({
            Name: u.name,
            Email: u.email,
            Role: u.role,
            Status: u.isBlocked ? 'Blocked' : 'Active'
        })));

        console.log('\n--- 📰 NEWS ARTICLES ---');
        const articles = await Article.find({}, 'title category views');
        console.table(articles.map(a => ({
            Title: a.title.substring(0, 40) + '...',
            Category: a.category,
            Views: a.views
        })));

        console.log('\n--- 💬 COMMENTS ---');
        const comments = await Comment.countDocuments();
        console.log(`Total Comments: ${comments}`);

        console.log('\n--- 📧 FEEDBACK ---');
        const feedbacks = await Feedback.countDocuments();
        console.log(`Total Feedback: ${feedbacks}`);

        console.log('\n-----------------------------------');
        process.exit();
    } catch (err) {
        console.error('Error viewing data:', err);
        process.exit(1);
    }
};

viewData();
