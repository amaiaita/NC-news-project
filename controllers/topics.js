const { obtainTopics, addTopic } = require("../models/topics");

exports.getTopics = (req, res, next) => {
  obtainTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  const topic = req.body;
  addTopic(topic).then((topic) => {
    console.log(topic);
    res.status(201).send({ topic });
  });
};
