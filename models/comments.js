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
    return db
      .query(
        `
          DELETE FROM comments
          WHERE comment_id = $1
          RETURNING *;
          `,
        [commentId]
      )
      .then((res) => {
        return res.rows;
      });
  });
};
