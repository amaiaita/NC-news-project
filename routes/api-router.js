const { getApi } = require("../controllers/api");

const apiRouter = require("express").Router();

apiRouter.get("/", getApi);

module.exports = apiRouter;
