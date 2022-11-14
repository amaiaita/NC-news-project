const {
  obtainArticles,
  obtainArticleCommentsByID,
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  obtainArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  obtainArticleCommentsByID(article_id).then((comments) => {
    res.status(200).send({ comments });
  });
};
