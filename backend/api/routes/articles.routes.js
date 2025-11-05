import { Router } from "express"
import { createArticle, getArticle, getArticles, getArticlesByUserId, updateArticle, deleteArticle } from "../controllers/articles.controller.js";
import { authorizeUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/articles", getArticles);
router.post("/:userId/articles", authorizeUser, createArticle);
router.get("/:userId/article/:id", authorizeUser, getArticle);
router.get("/:userId/articles", authorizeUser, getArticlesByUserId);
router.patch("/:userId/articles/:id", authorizeUser, updateArticle);
router.delete("/:userId/articles/:id", authorizeUser, deleteArticle);

export default router;