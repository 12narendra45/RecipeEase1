const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User=require("../models/User")
const router = express.Router()
require('dotenv').config()

router.post('/register', async (req, res) => {
  const { name, email, username,password } = req.body
  if (!name || !email || !username || !password) return res.status(400).json({ error: 'Missing fields' })
  if (await User.findOne({ $or: [{ email }, { username }] })) {
    return res.status(409).json({ error: 'Email or username already in use' })
  }
  const hash = await bcrypt.hash(password, 10)
  await new User({ name, email, username,password: hash }).save()
  res.status(201).json({ message: 'Registered successfully' })
})


router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body
  const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { name: user.name, email: user.email, username: user.username} })
})

module.exports = router
