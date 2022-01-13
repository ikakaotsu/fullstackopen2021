const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken")
const Note = require("../models/note");
const User = require("../models/user")

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

//{{{Get All Notes 
notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  res.json(notes.map((note) => note.toJSON()));
});
//}}}

//{{{ Index 
notesRouter.get("/home", (req, res) => {
  res.send("<h1>Hola Mundo</h1>");
});
//}}}

//{{{ Find Note 
notesRouter.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});
//}}}

//{{{ New Note 
notesRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const user = await User.findById(decodedToken.id)

  if (body.content === undefined) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id
  });

  const saveNote = await note.save();
  user.notes = user.notes.concat(saveNote._id)
  await user.save()
  res.json(saveNote.toJSON());

});
//}}}

//{{{ Delete Note 
notesRouter.delete("/:id", async (req, res, next) => {
  try {
    await Note.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
//}}}

//{{{ Update Note 
notesRouter.put("/:id", (req, res, next) => {
  const body = req.body;

  // const newNote = {
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
///}}}

module.exports = notesRouter;
