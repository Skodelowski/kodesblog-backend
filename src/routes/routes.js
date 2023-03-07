// ROUTES

// User
// - Read Posts (GET)
// - Create & Update Post (his/her post)
// - Favorites
// (optionnal)
// - Write Comment

// Admin
// - Create, Update & Delete Post (all)
// (optionnal)
// - Create, Update & Delete Comment (all)
// - Create, Update & Delete Category (What about children categories when parents ones are deleted ?)

// Errors

import express from 'express'
import auth from '../middlewares/auth.js'
import cors from 'cors'
const router = express.Router()

// Controllers
import UserController from '../controllers/UserController.js'

//* Authentication
router.post('/login', UserController.login)

//* Users
router.get('/users', auth, UserController.getAllUsers)
router.get('/user/:id', auth, UserController.getUserById)
router.post('/users/add', UserController.addUser)
router.put('/users/:id/edit', auth, UserController.updateUser)
router.delete('/users/:id/delete', auth, UserController.deleteUserById)

// Fake data
router.post('/users/add-fakes', UserController.importFakeUsers)
router.delete('/users/delete-all', UserController.deleteAllUsers)

router.get('/', function (req, res) {
  res.json({ message: 'Connected' })
})
// ...

export default router
