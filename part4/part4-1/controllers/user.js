const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (req, res) => {
  const body = req.body
  const saltRounds = 10

  if (!body.username || body.username.length < 3) {
    res.status(400).json({ error: "username is empty or shorter(length 3)" })
  } else {

    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    res.json(savedUser)

  }
})


userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  res.json(users.map(u => u.toJSON()))
})

module.exports = userRouter
