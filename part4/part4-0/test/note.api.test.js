const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const Note = require("../models/note");

beforeEach(async () => {
  await Note.deleteMany({});

  const noteObjects = helper.initialNotes.map((note) => new Note(note));
  const promiseArray = noteObjects.map((note) => note.save());
  await Promise.all(promiseArray);
});

const api = supertest(app);

//{{{ initially Notes
describe('when there is initially some notes saved', () => {
  test("the first note is about HTTP methods", async () => {
    const response = await api.get("/api/notes");

    expect(response.body[0].content).toBe("HTML is easy");
  });
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(helper.initialNotes.length);
  });
  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");

    const contents = response.body.map((r) => r.content);
    expect(contents).toContain("Browser can execute only Javascript");
  });
  test("there are two notes", async () => {
    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(2);
  });
});
//}}}

//{{{ Specific note
describe('viewing a specific note', () => {
  test("a specific note can be viewed", async () => {
    const noteAtStart = await helper.notesInDb();

    const noteToView = noteAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

    expect(resultNote.body).toEqual(processedNoteToView);
  });
  test("fail with statuscode 404 if note does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    console.log('Esto devuelvee VALIDNONEXISTINGID', validNonexistingId)

    await api.get(`/api/notes/${validNonexistingId}`).expect(404);
  });
  test("fails with statuscode 400 id is invalid", async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api.get(`/api/notes/${invalidId}`).expect(400);
  })
})
//}}}

//{{{ Add Notes
describe("addition of a new note", () => {
  test("a valid note can be added", async () => {
    const newNote = {
      content: "async/await simplyfies making async calls",
      "date": "2021-11-16T13:37:14.330Z",
      important: true,
      "userId": "61982ccc2f0e9d1f524665c5"
    };
    await api
      .post("/api/notes")
      .send(newNote)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    //const response = await api.get("/api/notes");
    const noteAtEnd = await helper.notesInDb();
    expect(noteAtEnd).toHaveLength(helper.initialNotes.length + 1);

    const contents = noteAtEnd.map((r) => r.content);
    expect(contents).toContain("async/await simplyfies making async calls");
  });
  test("note without content is not added", async () => {
    const newNote = { important: true };
    await api.post("/api/notes").send(newNote).expect(400);
    const noteAtEnd = await helper.notesInDb();
    expect(noteAtEnd).toHaveLength(helper.initialNotes.length);
  });
})
//}}}

//{{{ Delete Note
describe("deletion of a note", () => {
  test("a note can be deleted", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);
    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map((r) => r.content);

    expect(contents).not.toContain(noteToDelete.content);
  });
})
//}}}

afterAll(() => {
  mongoose.connection.close();
});
