const { obtainUsers } = require("../models/users");

exports.getUsers = (req, res, next) => {
  obtainUsers().then((users) => {
    res.status(200).send({ users });
  });
};
