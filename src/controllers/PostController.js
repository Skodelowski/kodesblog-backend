import PostModel from '../Models/Post.js'
import UserModel from '../Models/User.js'
import ImageModel from '../Models/Image.js'
import PostLikeModel from '../Models/PostLike.js'
import { verifyPostContent } from '../utils/post.js'

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
  const { author, title, content, imageName, imageDesc, category, tags } =
    req.body

  const url = req.protocol + '://' + req.get('host')

  let postDataIsVerified = verifyPostContent(req.body, req.file)

  if (!postDataIsVerified.error) {
    const image = {
      name: imageName,
      description: imageDesc,
      img: {
        path: url + '/public/uploads/' + req.file.filename,
        contentType: req.file.mimetype,
      },
    }
    const newImage = new ImageModel(image)
    newImage.save().then((dataImage) => {
      let imagePath =
        dataImage && dataImage.img.path ? dataImage.img.path : null
      const Post = new PostModel({
        author: author,
        title: title,
        content: content,
        image: imagePath,
        category: category,
        tags: tags,
      })

      Post.save()
        .then((postData) => {
          res
            .status(200)
            .send({ message: 'Post created successfully !', post: postData })
        })
        .catch((err) => {
          console.log(err.message)
          res.status(500).send({
            message:
              'An error has occurred, please verify that all required inputs are filled.',
            error: err.message,
          })
        })
    })
  } else {
    res.status(500).send({
      message: postDataIsVerified.message,
    })
  }
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
const toggleLike = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  PostLikeModel.findOne({ user: userId, post: id })
    .then((post) => {
      if (post) {
        let count = post.like ? -1 : 1
        // Link between user & post exists
        PostModel.findOneAndUpdate(
          { _id: post.post },
          { $inc: { likeCount: count } },
          { new: true },
        )
          .then((updatedPost) => {
            // User already liked the post
            PostLikeModel.findOneAndUpdate(
              { post: post.post },
              { like: !post.like },
            )
              .then((data) => {
                res
                  .status(200)
                  .send({ message: 'Like modified', data: updatedPost })
              })
              .catch((err) => {
                res.status(500).send({
                  message: 'Error when updating Like/Post',
                  data: err.message,
                })
              })
          })
          .catch((err) => {
            res.status(500).send({
              message: 'Error when updating Post',
              data: err.message,
            })
          })
      } else {
        // Link between user & post does not exist yet
        const PostLikeRelation = new PostLikeModel({ user: userId, post: id })

        PostLikeRelation.save()
          .then((postLike) => {
            PostModel.findOneAndUpdate(
              { _id: postLike.post },
              { $inc: { likeCount: 1 } },
              { new: true },
            )
              .then((updatedPost) => {
                res
                  .status(200)
                  .send({ message: 'Like added', data: updatedPost })
              })
              .catch((err) => {
                res.status(500).send({
                  message: 'Error when updating Post',
                  data: err.message,
                })
              })
          })
          .catch((err) => {
            res.status(500).send({
              message: 'Error when saving the relation Like/Post',
              data: err.message,
            })
          })
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
