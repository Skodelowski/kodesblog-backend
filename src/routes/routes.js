// ROUTES

// Authentication
// - Create User (Sign up)
// - Login (Sign in)
// - Logout (Sign out)

// User
// - Read Posts
// - Create & Update Post (his/her post)
// - Update his/her profile
// - Favorites
// (optionnal)
// - Write Comment

// Admin
// - Create, Update & Delete Post (all)
// - Create, Update & Delete User
// - Give admin role
// (optionnal)
// - Create, Update & Delete Comment (all)
// - Create, Update & Delete Category (What about children categories when parents ones are deleted ?)

import express from 'express'
import auth from '../middlewares/auth.js'
import cors from 'cors'
const router = express.Router()

router.get('/', function (req, res) {
  res.json({ message: 'Connected' })
})
// ...

export default router
