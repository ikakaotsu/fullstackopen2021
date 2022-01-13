const Note = require("../models/note");
const User = require("../models/user")

const initialUsers = [
  {
    "username": "root",
    "name": "Superuser",
    "password": "1234",
    "notes": []
  },
  {
    "username": "ika",
    "name": "ikakaotsu",
    "password": "4321",
    "notes": []
  }

]

const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: true,
  },
];

//Object ID that does not belong to any note object in DB
const nonExistingId = async () => {
  const note = new Note({ content: "willremovethissoon", date: new Date() });
  await note.save();
  await note.remove();

  return note._id.toString();
};

//Checking the notes stored in the DB
const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
};
