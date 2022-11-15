const db = require("../db/connection");

exports.obtainUsers = () => {
  return db
    .query(
      `
    SELECT * FROM users
    `
    )
    .then((users) => {
      return users.rows;
    });
};
