const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')
const router = express.Router()
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId, '-password')
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})
module.exports = router
