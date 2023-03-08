import PostModel from '../Models/Post.js'
import UserModel from '../Models/User.js'
import ImageModel from '../Models/Image.js'
import PostLikeModel from '../Models/PostLike.js'
import fs from 'fs'

//* GET/ Get all posts
const getAllPosts = async (req, res) => {
  PostModel.find()
    .then((posts) => {
      res.status(200).send({
        message: 'All posts',
        fullData: posts,
      })
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error', error: err.message })
    })
}

//* GET/ Get a posts by its id
const getPostById = async (req, res) => {
  const { id } = req.params
  PostModel.findById(id)
    .then((post) => {
      res.status(200).send({ message: 'Post found !', post: post })
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'An error has occurred', error: err.message })
    })
}

//* GET/ Get all posts of a specific user (by its id)
const getUserPosts = async (req, res) => {
  const { userId } = req.params
  UserModel.findById(userId)
    .then((user) => {
      PostModel.find({ author: user._id })
        .then((posts) => {
          res.status(200).send({
            message: `All posts of ${user.firstname} ${user.lastname}.`,
            posts: posts,
          })
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error (posts)', error: err.message })
        })
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error (user)', error: err.message })
    })
}

//* POST/ Create a new post
const addPost = async (req, res) => {
  const { authorId, title, content, imageName, imageDesc, category, tags } =
    req.body
  const image = {
    name: imageName,
    description: imageDesc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + '/public/uploads/' + req.file.filename),
      ),
      contentType: 'image/png',
    },
  }
  const newImage = new ImageModel(image)
  newImage.save().then((dataImage) => {
    let imageId = dataImage && dataImage._id ? dataImage._id : null
    const Post = new PostModel({
      author: authorId,
      title: title,
      content: content,
      image: imageId,
      category: category,
      tags: tags,
    })
  })
}

//* PUT/ Update an existing post (if original author or admin)
const updatePost = async (req, res) => {
  if (req.user.id == req.body.author || req.user.isAdmin) {
    PostModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    })
      .then((post) => {
        res
          .status(200)
          .send({ message: 'Post successfully updated', post: post })
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error', error: err.message })
      })
  } else {
    res.status(401).send({ message: 'Access denied' })
  }
}

//* PUT/ Increment the likes counter of a post (and vice versa)
const toggleLike = async (res, req) => {
  const { postId } = req.params
  const userId = req.user.id
  PostLikeModel.find({ user: userId, post: postId })
    .then((post) => {
      if (post) {
        PostModel.findOneAndUpdate(
          { _id: post.id },
          { likeCount: post.likeCount-- },
        )
      } else {
        PostModel.findOneAndUpdate(
          { _id: post.id },
          { likeCount: post.likeCount++ },
        )
      }
    })
    .catch((err) => {
      res.status(500).send({ message: 'An error has occurred.' })
    })
}

//! DELETE/ Delete a post (admin only)
const deletePost = async (req, res) => {
  const { id } = req.params
  if (req.user.isAdmin) {
    PostModel.findOneAndDelete({ _id: id })
      .then(() => {
        res.status(200).send({ message: 'Post successfully deleted.' })
        return
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: 'An error has occurred.', error: err.message })
        return
      })
  } else {
    return res.status(403).send({ message: 'Unauthorized.' })
  }
}

export default {
  getAllPosts,
  getPostById,
  getUserPosts,
  addPost,
  updatePost,
  toggleLike,
  deletePost,
}
