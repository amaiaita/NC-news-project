const db = require("../db/connection");

exports.obtainTopics = () => {
  return db
    .query(
      `
        SELECT * FROM topics
        `
    )
    .then((topics) => {
      return topics.rows;
    });
};

exports.addTopic = (topicBody) => {
  const { slug, description } = topicBody;
  return db
    .query(
      `
  INSERT INTO topics
    (slug,description)
  VALUES
    ($1,$2)
  RETURNING *
  `,
      [slug, description]
    )
    .then((res) => {
      return res.rows[0];
    });
};
