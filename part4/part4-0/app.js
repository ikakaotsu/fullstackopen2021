const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const mongoose = require("mongoose");

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

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

app.use(middleware.unknownEndpoint);
// handler of reqs with result to errors
app.use(middleware.errorHandler);

module.exports = app;
