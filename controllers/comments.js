const { removeComment } = require("../models/comments");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((comment) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
