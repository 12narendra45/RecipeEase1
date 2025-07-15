
const jwt = require('jsonwebtoken')
require('dotenv').config()
module.exports = function (req, res, next) {
  const auth = req.header('Authorization')?.split(' ')[1]
  if (!auth) return res.status(401).json({ error: 'No token' })
  jwt.verify(auth, process.env.JWT_SECRET, (err,decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' })
    req.userId = decoded.id
    next()
  })
}
