// import express from "express";
require("dotenv").config();
const { json } = require("express");
const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

/*Index */
app.get("/", (req, res) => {
  res.send("<h1>Ejercicion 3-1 Phonebook </h1>");
});

/*Get All Persons*/
app.get("/api/persons", (req, res) => {
  // res.send(persons);
  Person.find({}).then((person) => {
    res.json(person);
  });
});

/**Create Person */
app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savePerson) => {
      // res.json(savePerson);
      res.json(savePerson.toJSON());
    })
    .catch((err) => next(err));
});

/**Update Person */
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  //Al crear una Person nueva se crea un nuevo id,
  // esto genera un error, no se puede sobreescribir :id
  /*   const person = new Person({
    name: body.name,
    number: body.number,
  }); */

  Person.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: body.name,
        number: body.number,
      },
    },
    { new: true }
  )
    .then((updatePerson) => res.json(updatePerson))
    .catch((err) => next(err));
});

/** Delete Person */
app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log(result);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

/**Info total of Peoples */
app.get("/info", (req, res) => {
  let date = new Date();
  let fulldate = Intl.DateTimeFormat("es-AR", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);
  let nropeople = persons.length;
  res.send(`Phonebook has info ${nropeople} people <br /> <br /> ${fulldate}`);
});

/**Find Person */
app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.menssage });
  }
  next(error);
};
// handler of requests with result to errors
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor Corriendo en el puerto ${PORT}`));
