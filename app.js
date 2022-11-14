const express = require("express");
const {
  getArticles,
  getArticleCommentsById,
} = require("./controllers/articles");
const { getTopics } = require("./controllers/topics");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsById);

module.exports = app;
