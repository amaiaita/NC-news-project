const express = require("express");
const apiRouter = require("./routes/api-router");
const articlesRouter = require("./routes/articles-router");
const commentsRouter = require("./routes/comments-router");
const topicsRouter = require("./routes/topics-router");
const usersRouter = require("./routes/users-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

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
    res.status(400).send({
      msg: "Bad Request: Invalid Data Type to one or more categories ",
    });
  }
});

module.exports = app;
