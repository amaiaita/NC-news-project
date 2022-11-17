const db = require("../db/connection");
const { checkCommentExists } = require("../utils");

exports.removeComment = (commentId) => {
  if (!Number(commentId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Comment ID - ID is not a number",
    });
  }
  return checkCommentExists(commentId).then(() => {
    return db.query(
      `
          DELETE FROM comments
          WHERE comment_id = $1;
          `,
      [commentId]
    );
  });
};

exports.editComment = (commentId, votes) => {
  if (!Number(commentId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Comment ID - ID is not a number",
    });
  }
  return checkCommentExists(commentId).then(() => {
    return db
      .query(
        `
          UPDATE comments
          SET votes = votes + $1
          WHERE comment_id = $2
          RETURNING *;
          `,
        [votes, commentId]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
