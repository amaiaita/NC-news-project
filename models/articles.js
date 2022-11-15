const db = require("../db/connection");
const { checkArticleExists } = require("../utils");

exports.obtainArticles = (topic, sortby = "created_at", order = "desc") => {
  let topicStatement = "";
  let queryValues = [];
  const acceptedOrders = [
    "topic",
    "author",
    "title",
    "article_id",
    "created_at",
    "votes",
    "comment_count",
  ];
  const acceptedSort = ["asc", "desc"];
  if (!acceptedOrders.includes(sortby)) {
    return Promise.reject({ status: 400, msg: "unacceptable sort by query" });
  }
  if (!acceptedSort.includes(order)) {
    return Promise.reject({ status: 400, msg: "unacceptable order query" });
  }
  if (topic) {
    topicStatement = "WHERE topic = $1";
    queryValues.push(topic);
  }
  return db
    .query(
      `   
        SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id=articles.article_id
        ${topicStatement}
        GROUP BY articles.article_id
        ORDER BY ${sortby} ${order};
    `,
      queryValues
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

exports.editArticleById = (articleId, edit) => {
  const { inc_votes } = edit;
  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;
  `,
      [inc_votes, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.addComment = (idNumber, commentBody) => {
  if (!Number(idNumber)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Invalid Data Type for ID",
    });
  }
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
