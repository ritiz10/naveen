const { Article, User } = require('../models');
const { Op } = require('sequelize');

const getArticles = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.search
            ? {
                  title: {
                      [Op.like]: `%${req.query.search}%`,
                  },
              }
            : {};

        const categoryFilter = req.query.cat && req.query.cat !== 'all news'
            ? { category: req.query.cat }
            : {};

        const whereClause = { ...keyword, ...categoryFilter };
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const articles = await Article.find({})
            .populate('author', 'name profile_id')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await Article.countDocuments();

        res.json({
            articles,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching articles' });
    }
};

// @desc    Get single article
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'name');
        if (!article) return res.status(404).json({ message: 'Article not found' });
        
        // Increment views
        article.views += 1;
        await article.save();
        
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching article' });
    }
};

// @desc    Create new article (Admin)
const createArticle = async (req, res) => {
    try {
        const { title, content, category, image_url } = req.body;

        const article = await Article.create({
            title,
            content,
            category,
            image_url,
            author: req.user._id
        });

        emitStats(req);
        res.status(201).json(article);
    } catch (err) {
        res.status(500).json({ message: 'Error creating article' });
    }
};

// @desc    Update article (Admin)
const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: 'Error updating article' });
    }
};

// @desc    Delete article (Admin)
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        
        emitStats(req);
        res.json({ message: 'Article deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting article' });
    }
};

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};
