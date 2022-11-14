const express = require("express");
const { getArticles, getArticleByID } = require("./controllers/articles");
const { getTopics } = require("./controllers/topics");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
