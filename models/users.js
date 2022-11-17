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

exports.obtainUserByUsername = (username) => {
  return db
    .query(
      `
  SELECT * FROM users
  WHERE username = $1;
  `,
      [username]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Username does not exist" });
      }
      return res.rows[0];
    });
};
