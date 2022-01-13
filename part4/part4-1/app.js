const cors = require("cors");
const middleware = require("./utils/middleware");
const userRouter = require("./controllers/user");
const blogRouter = require("./controllers/blogs");
const config = require("./utils/config");
const express = require("express");
const logger = require("./utils/logger");
const loginRouter = require("./controllers/login")
const mongoose = require("mongoose");

const app = express();

logger.info("connecting to ", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((err) => {
    logger.error("error connecting to MongoDb:", err.message);
  });

app.use(cors());
app.use(express.static("build")); //middleware, muestra contenido estatico
app.use(express.json());
app.use(middleware.reqLogger);
app.use(middleware.tokenExtractor)

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter)

app.use(middleware.unknownEndpoint);
// handler of reqs with result to errors
app.use(middleware.errorHandler);

module.exports = app;
