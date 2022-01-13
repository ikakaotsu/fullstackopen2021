const logger = require("./logger");
const jwt = require("jsonwebtoken")

const reqLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};

//{{{ EndPoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
//}}}

//{{{ ErrorHandler
const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  logger.error(error.message)
  next(error)
};
//}}}

//{{{ tokenExtractor
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // return authorization.substring(7)
    req["token"] = authorization.substring(7)
  }
  next()
}
//}}}

//{{{ TokenValidator
const tokenValidator = (req, res, next) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }
}
//}}}

module.exports = {
  reqLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  tokenValidator,
};
