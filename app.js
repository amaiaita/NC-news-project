const express = require("express");
const {
  getArticles,
  getArticleByID,
  getArticleCommentsById,
  patchArticleById,
  postComment,
} = require("./controllers/articles");
const { getTopics } = require("./controllers/topics");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", postComment);

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  if (err.code === "23502") {
    res.status(400).send({ msg: "Incorrect Request Format" });
  }
  if (err.code === "23503") {
    res
      .status(400)
      .send({ msg: "Incorrect data input to one or more categories" });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request: Invalid Data Type to one or more categories " });
  }
});

module.exports = app;
