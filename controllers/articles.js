const {
  obtainArticles,
  obtainArticleCommentsByID,
  obtainArticleByID,
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  obtainArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  obtainArticleCommentsByID(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  obtainArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
