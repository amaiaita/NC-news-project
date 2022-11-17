const {
  obtainArticles,
  obtainArticleCommentsByID,
  obtainArticleByID,
  editArticleById,
  addComment,
  addArticle,
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order,limit,p} = req.query;
  obtainArticles(topic, sort_by, order,limit,p)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
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

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const edit = req.body;
  editArticleById(article_id, edit)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  addComment(article_id, comment)
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const article = req.body;
  addArticle(article)
    .then((newArticle) => {
      res.status(201).send({ article: newArticle });
    })
    .catch((err) => next(err));
};
