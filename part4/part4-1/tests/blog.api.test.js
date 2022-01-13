const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("../utils/list_helpers");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Blog = require("../models/blog");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObject = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObject.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

//{{{ Json and Restrict 
describe("Test of Json response and restric options", () => {

  test("Blogs are returned as json ", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Correct amount of blog posts in the JSON format", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(helper.initialBlogs.length);
  });
  ;

  test("unique identifier property of the blog post is named id", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    expect(blog.id).toBeDefined();
  });
})
//}}}

//{{{ Adding a new Blog
describe("add a new blog", () => {
  let token = null
  beforeAll(async () => {
    await User.deleteMany({});

    const testUser = await new User({
      username: "MrPopo",
      name: "Popo",
      passwordHash: await bcrypt.hash("123456", 10),
    }).save()

    const userForToken = { username: "Mr Popo", id: testUser.id }
    token = jwt.sign(userForToken, process.env.SECRET)
    return token
  })

  test("create a new blog post", async () => {
    const newBlog = {
      title: "Hey new Blog",
      author: "the EloffGuy",
      url: "http://spaceY.com",
      likes: 19,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const checkaddedBlog = await helper.blogInDb();
    expect(checkaddedBlog.length).toBe(helper.initialBlogs.length + 1);

    const title = checkaddedBlog.map(b => b.title);
    expect(title).toContain("Hey new Blog");
  });

  // test("check like property exist and if not return 0", async () => {
  //   const newBlog = {
  //     title: "Hey new Blog",
  //     author: "GimeTheCrypto",
  //     url: "http://cryptodog.com",
  //   }
  //   const response = await api.post('/api/blogs').send(newBlog).expect(200).expect("Content-Type", /application\/json/);
  //   expect(response.body.likes).toBeDefined();
  //   expect(response.body.likes).toBe(0);
  // });

  // test("non-existent title and url properties", async () => {
  //   const newBlog = {
  //     author: "radiohead",
  //     likes: 4,
  //   }
  //   await api.post('/api/blogs').send(newBlog).expect(400);
  //   const blogAtEnd = await helper.blogInDb();
  //   expect(blogAtEnd.length).toBe(helper.initialBlogs.length);
  // });

});//}}}

//{{{ Delete a Blog
describe("Delete of a Blog", () => {
  let token = null
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const tempUser = await new User({
      username: 'UserTemp1',
      passwordHash: await bcrypt.hash('123456', 10),
    }).save()

    const userForToken = { username: 'UserTemp1', id: tempUser.id }
    token = jwt.sign(userForToken, process.env.SECRET)

    const newBlog = {
      title: "Hey new Blog",
      author: "the EloffGuy",
      url: "http://spaceY.com",
      likes: 19,
    }

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(200)

    return token
  })
  test('test can delete a blog?', async () => {
    const blogsAtStart = await helper.blogInDb()
    const blogToDelete = blogsAtStart[0] //bring the first blog

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204) //204 No Content

    const blogsAtEnd = await helper.blogInDb()

    expect(blogsAtEnd).toHaveLength(0) //Longitud = 0
  })
})
//}}}

//{{{ Update Blog
describe('Update a Blog', () => {
  let token = null
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const tempUser = await new User({
      username: 'UserTemp1',
      passwordHash: await bcrypt.hash('123456', 10),
    }).save()

    const userForToken = { username: 'UserTemp1', id: tempUser.id }
    token = jwt.sign(userForToken, process.env.SECRET)

    const newBlog = {
      title: "Hey new Blog",
      author: "the EloffGuy",
      url: "http://spaceY.com",
      likes: 19,
      "userId": tempUser.id
    }

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    return token
  })

  test('test can update a blog?', async () => {
    const updateBlog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    }

    const getAllBlogs = await helper.blogInDb() //All Blogs
    const blogToUpdate = getAllBlogs[0] //First Blog

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAfterUpdate = await helper.blogInDb() //All After
    const updatedBlog = blogsAfterUpdate[0] //First After

    expect(blogsAfterUpdate).toHaveLength(getAllBlogs.length) //Same LENGTH
    expect(updatedBlog.likes).toBe(7)//Exist changes
    expect(updatedBlog.author).toBe('Michael Chan')//Exist changes
  })
})//}}}

afterAll(() => {
  mongoose.connection.close();
});
