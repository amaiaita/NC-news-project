const {
  getArticles,
  getArticleByID,
  getArticleCommentsById,
  patchArticleById,
  postComment,
  postArticle,
} = require("../controllers/articles");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleByID);
articlesRouter.get("/:article_id/comments", getArticleCommentsById);

articlesRouter.patch("/:article_id", patchArticleById);

articlesRouter.post("/:article_id/comments", postComment);
articlesRouter.post("/", postArticle);

module.exports = articlesRouter;
