const { obtainUsers, obtainUserByUsername } = require("../models/users");

exports.getUsers = (req, res, next) => {
  obtainUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  obtainUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => next(err));
};
