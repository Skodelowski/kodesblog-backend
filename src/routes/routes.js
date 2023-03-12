import express from 'express'
import auth from '../middlewares/auth.js'
import createUser from '../middlewares/create-user.js'
import multer from 'multer'
const router = express.Router()

// ==========
// Storage initialization
// ==========

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

var upload = multer({ storage: storage })
var imageFile = upload.single('photo')

// Controllers
import UserController from '../controllers/UserController.js'
import CategoryController from '../controllers/CategoryController.js'
import PostController from '../controllers/PostController.js'
import ImageController from '../controllers/ImageController.js'

//* Authentication
router.post('/login', UserController.login)
router.post('/users/add', createUser, UserController.addUser)

//* Users
router.get('/users', auth, UserController.getAllUsers)
router.get('/user/:id', auth, UserController.getUserById)
router.get('/users/:id/likes', auth, UserController.getPostsLiked)
router.put('/users/:id/edit', auth, UserController.updateUser)
router.delete('/users/:id/delete', auth, UserController.deleteUserById)

//* Categories
router.get('/categories', CategoryController.getAllCategories)
router.get('/categories/:slug', CategoryController.getCategory)
router.get('/categories/:slug/posts', CategoryController.getPostsByCategory)
router.post('/categories/add', auth, CategoryController.addCategory)
router.delete(
  '/categories/:slug/delete',
  auth,
  CategoryController.deleteCategory,
)

//* Posts
router.get('/posts/all', auth, PostController.getAllPosts)
router.get('/posts/:user', auth, PostController.getUserPosts)
router.get('/posts/:id', auth, PostController.getPostById)
router.post('/posts/add', auth, imageFile, PostController.addPost)
router.put('/posts/:id/edit', auth, PostController.updatePost)
router.put('/posts/:id/like', auth, PostController.toggleLike)
router.delete('/posts/:id/delete', auth, PostController.deletePost)

//* Images
router.get('/images/all', auth, ImageController.getAllImages)

// Import data
router.post('/users/add-fakes', UserController.importFakeUsers)
router.post('/categories/add-base', CategoryController.importCategories)
router.delete('/users/delete-all', UserController.deleteAllUsers)

router.get('/', function (req, res) {
  res.json({ message: 'Connected' })
})
// ...

export default router
