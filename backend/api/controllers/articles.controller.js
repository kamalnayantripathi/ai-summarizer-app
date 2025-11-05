import { Article } from "../models/article.model.js"

const createArticle = async(req, res) => {
    try {
        const { title, content } = req.body;
        if(!title || !content) return res.status(401).json({ message: "All fields are required."});
        const userId = req.params.userId;
        const author = req.user.id;
        if(!author || !userId) return res.status(401).json({ message: "Login to create an article."});
        console.log("userId", userId,"author", author);
        if(userId !== author) return res.status(403).json({ message: "Bad request" });
        const article = await Article.create({
            title,
            content,
            author
        })
        return res.status(200).json({
            statusCode: 200,
            article,
            message: "Article created successfully."
        })
    } catch (error) {
        return res.status(401).json({ message: error.message || "Something went wrong while creating the article."})
    }
}

const getArticle = async(req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId)
        if(!article) return res.status(400).json({ message: "Couldn't find the article."})
        return res.status(200).json({
            statusCode: 200,
            article,
            message: "Article fetched successfully."
        })    
    } catch (error) {
        return res.status(401).json({ message: error.message || "Something went wrong while fetching the article."})
    }
}

const getArticles = async(req, res) => {
    try {
        const articles = await Article.find()
        return res.status(200).json({
            statusCode: 200,
            articles,
            message: "Articles fetched successfully."
        })
    } catch (error) {
        return res.status(401).json({ message: error.message || "Couldn't fetch articles."})
    }
}

const getArticlesByUserId = async(req, res) => {
    try {
        const author = req.user.id;
        const userId = req.params.userId;
        console.log(req.params, "userId", userId,"author", author, userId===author);
        const articles = await Article.find({ author: userId })
        return res.status(200).json({
            statusCode: 200,
            articles,
            message: "Articles fetched successfully."
        })
    } catch (error) {
        return res.status(401).json({ message: error.message || "Couldn't fetch user articles."})
    }
}

const updateArticle = async(req, res) => {
    try {
        const articleId = req.params.id;
        const { title, content } = req.body;
        if(!articleId || !title || !content) return res.status(401).json({ message: "All fields are requird."});
        const updatedArticle = await Article.findByIdAndUpdate(articleId, {
            title,
            content
        })
        if(!updatedArticle) return res.status(400).json({ message: "Couldn't update the article."});
        return res.status(200).json({
            statusCode: 200,
            updatedArticle,
            message: "Article updated successfully."
        })
    } catch (error) {
        return res.status(401).json({ message: error.message || "Couldn't update the article."})
    }
}

const deleteArticle = async(req, res) => {
    try {
        const articleId = req.params.id;
        const deletedArticle = await Article.findByIdAndDelete(articleId)
        if(!deletedArticle) return res.status(400).json({ message: "Couldn't delete the article."});
        return res.status(200).json({
            statusCode: 200,
            deletedArticle,
            message: "Article deleted successfully."
        })
    } catch (error) {
        return res.status(401).json({ message: error.message || "Couldn't delete the article."})
    }
}

export {
    createArticle,
    getArticle,
    getArticles,
    getArticlesByUserId,
    updateArticle,
    deleteArticle
}