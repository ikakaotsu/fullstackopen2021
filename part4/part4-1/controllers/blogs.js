const blogRouter = require('express').Router()
const jwt = require("jsonwebtoken")
const Blog = require('../models/blog')
const User = require('../models/user')


//{{{ Get Method
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs.map((blog) => blog.toJSON()))
})
//}}}

//{{{ Post Method
blogRouter.post("/", async (req, res, next) => {

  const body = req.body;

  const token = req.token

  const decodedToken = jwt.verify(token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  if (body.title === undefined) {
    return res.status(400).json({
      error: "title missing",
    });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  });

  try {
    const saveBlog = await blog.save();
    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()
    res.json(saveBlog.toJSON());

  } catch (e) {
    console.log(e)
  }
})
//}}}

//{{{ Delete Method
blogRouter.delete('/:id', async (req, res, next) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  const blogToDelete = await Blog.findById(req.params.id)

  if (blogToDelete.user._id.toString() === user._id.toString()) {
    try {
      await Blog.findByIdAndRemove(req.params.id)
      res.status(204).end() //204 NoContent, succeeded. Like save and continue editing
    } catch (e) {
      next(e)
    }
  } else {
    return res.status(401).json({ error: `Unauthorized` }) // 401 Unauthorized, lack of valid authentication
  }
})
//}}}

//{{{ Put Method
blogRouter.put('/:id', async (req, res, next) => {
  const body = req.body
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  const blogToUpdate = await Blog.findById(req.params.id)

  if (blogToUpdate.user._id.toString() === user._id.toString()) {
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };

    try {
      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
      res.json(updatedBlog.toJSON())

    } catch (e) {
      next(e)
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized' })
  }
})
//}}}

module.exports = blogRouter
