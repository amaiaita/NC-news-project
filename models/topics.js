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
