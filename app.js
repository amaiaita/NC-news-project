const express = require("express");
const {
  getArticles,
  getArticleByID,
  getArticleCommentsById,
  patchArticleById,
} = require("./controllers/articles");
const { getTopics } = require("./controllers/topics");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.patch("/api/articles/:article_id", patchArticleById);

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
