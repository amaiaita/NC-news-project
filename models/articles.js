const db = require("../db/connection");
const { checkArticleExists } = require("../utils");

exports.obtainArticles = () => {
  return db
    .query(
      `   
        SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id=articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `
    )
    .then((res) => {
      return res.rows;
    });
};

exports.obtainArticleCommentsByID = (articleId) => {
  if (!Number(articleId)) {
    return Promise.reject({ status: 400, msg: "Invalid ID data type" });
  }
  return checkArticleExists(articleId)
    .then(() => {
      return db.query(
        `
          SELECT comment_id, votes, created_at, author, body
          FROM comments
          WHERE article_id = $1
          ORDER BY created_at DESC;`,
        [articleId]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.obtainArticleByID = (articleId) => {
  if (!Number(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Invalid Data Type for ID",
    });
  }
  return db
    .query(
      `
        SELECT * FROM articles
        WHERE article_id = $1;
        `,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid ID" });
      }
      return rows[0];
    });
};

exports.addComment = (idNumber, commentBody) => {
  const { username, body } = commentBody;
  return checkArticleExists(idNumber)
    .then(() => {
      return db.query(
        `
          INSERT INTO comments
              (author,body,article_id)
          VALUES
              ($1,$2,$3)
          RETURNING *;
      `,
        [username, body, idNumber]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
