const { obtainArticles } = require("../models/articles");

exports.getArticles = (req, res, next) => {
  obtainArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};
