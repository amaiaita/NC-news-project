const { obtainTopics } = require("../models/topics");

exports.getTopics = (req, res, next) => {
  obtainTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
