const db = require("./db/connection");

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1;
    `,
      [article_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid article ID" });
      }
    });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(
      `
    SELECT * FROM topics
    WHERE slug = $1;
    `,
      [topic]
    )
    .then((res) => {
      if (res.rows.length === 0 && topic) {
        return Promise.reject({ status: 404, msg: "topic does not exist" });
      }
    });
};

exports.checkCommentExists = (commentId) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE comment_id=$1;
    `,
      [commentId]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Invalid Comment ID - This comment does not exist",
        });
      }
    });
};
