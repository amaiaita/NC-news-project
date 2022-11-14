const express = require("express");
const { getArticles } = require("./controllers/articles");
const { getTopics } = require("./controllers/topics");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

module.exports = app;
