const mongoose = require("mongoose")
const supertest = require("supertest")
const User = require("../models/user")
const app = require("../app")
const bcrypt = require('bcrypt')

const api = supertest(app)

const initUsers = [
  {
    name: "First User",
    username: "Nro 1",
  },
  {
    name: "Second User",
    username: "Nro 2",
  }
]

const usersInDB = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON())
}

describe('Initial Users in DB', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

  });

  test("Users are returned as JSON", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("New User is Crated", async () => {
    const usersAtStart = await usersInDB();

    const newUser = {
      username: 'LaJessi',
      name: 'Jessi Yesica',
      password: '1234',
    }

    await api.post('/api/users').send(newUser).expect(200).expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    // const usernames = usersAtEnd.map(u => u.username)
    // expect(usernames).toContain(newUser.username)
  })
  test("Users no valid", async () => {

    const newUser = {
      username: 'Je',
      name: 'Jessi Yesica',
      password: '1234',
    }
    const res = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    expect(res.text).toContain("username is empty or shorter(length 3)")
  });

})

afterAll(() => {
  mongoose.connection.close();
});


