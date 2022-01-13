require("dotenv").config();
const express = require("express");
const Note = require("./models/note");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build")); //middleware, muestra contenido estatico

const reqLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};

app.use(reqLogger);

/*Index */
app.get("/", (req, res) => {
  res.send("<h1>Hola Mundo</h1>");
});

/*Get All Notes */
app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

/*New Note */
app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  if (body.content === undefined) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
    .save()
    .then((saveNote) => {
      return saveNote.toJSON();
    })
    .then((savedAndFormattedNote) => {
      res.json(savedAndFormattedNote);
    })
    .catch((err) => next(err));
});

/*Update Note */
app.put("/api/notes/:id", (req, res, next) => {
  const body = req.body;

  // const note = {
  //   content: body.content,
  //   important: body.important,
  // };

  Note.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { important: body.important } },
    { new: true }
  )
    .then((updateNote) => {
      res.json(updateNote);
    })
    .catch((err) => next(err));
});

/*Delete Note */
app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

/*Find Note */
app.get("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
// handler of reqs with result to errors
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
