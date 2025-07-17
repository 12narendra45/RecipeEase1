
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(console.error)
const app = express()
app.use(cors(), express.json())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))
