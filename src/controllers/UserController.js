// ==========
// User Controller
// ==========

import UserModel from '../Models/User.js'
import fakeUsers from '../../data/users.js'
import { verifyPasswordSecurity } from '../utils/security.js'
import jwt from 'jsonwebtoken'

const APP_SECRET = `${process.env.APP_SECRET}`

/**
 * Authentication
 */

//* POST/ Login
const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Both inputs are required !' })
  }

  const { email, password } = req.body

  UserModel.findOne({ email })
    .then((user) => {
      if (user) {
        // User exists
        user = new UserModel(user)

        user.verifyPassword(password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            const accessToken = jwt.sign(
              { userEmail: user.email },
              APP_SECRET,
              {
                expiresIn: '24h',
              },
            )
            res.status(200).send({
              message: `${user.firstname} ${user.lastname} logged in successfully !`,
              token: accessToken,
              userId: user._id,
            })
          } else {
            return res.status(401).send({ message: "Password doesn't match." })
          }
        })
      } else {
        res.status(401).send({ message: "This user doesn't exist." })
      }
    })
    .catch((err) => {
      res.status(400).send({ message: 'An error has occurred.' })
    })
}

/**
 * Official API / CRUD
 */

//* GET/ Get all Users
const getAllUsers = async (req, res) => {
  UserModel.find()
    .then((users) => {
      res.status(200).send({ message: 'All users', data: users })
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error', error: err.message })
    })
}

//* GET/ Get user informations by its id
const getUserById = (req, res) => {
  const { id } = req.params
  UserModel.findOne({ _id: id })
    .then((user) => {
      res.status(200).send({ message: 'User found', user: user })
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error', message: err.message })
    })
  res.status(200).send({ status: 'Route en cours : getUsers', userId: id })
}

//* POST/ Add a new user
// (sign up, or added by an admin)
const addUser = async (req, res) => {
  const user = req.body
  let passwordVerification = verifyPasswordSecurity(user.password)

  if (!passwordVerification.error) {
    const User = new UserModel(user)

    User.save()
      .then((user) => {
        res
          .status(200)
          .send({ message: 'User successfully added !', user: user })
        return
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: 'An error has occurred.', error: err.message })
        return
      })
  } else {
    res.status(500).send({
      message: 'Password is unvalid',
      error: passwordVerification.message,
    })
    return
  }
}

//* PUT/ Update user
const updateUser = async (req, res) => {
  if (req.user.id == req.params.id || req.user.isAdmin) {
    const passwordVerification = verifyPasswordSecurity(req.body.password)
    if (!passwordVerification.error) {
      UserModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })
        .then((user) => {
          res
            .status(200)
            .send({ message: 'User successfully updated', user: user })
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error', error: err.message })
        })
    } else {
      return res.status(500).send({
        message: 'Password is unvalid',
        error: passwordVerification.message,
      })
    }
  } else {
    res.status(401).send({ message: 'Access denied' })
  }
}

//! DELETE/ Delete a user found by its id
const deleteUserById = (req, res) => {
  const { id } = req.params
  if (req.user.isAdmin) {
    UserModel.findByIdAndDelete({ _id: id })
      .then(() => {
        res.status(200).send({ message: 'User successfully deleted.' })
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

/**
 * Temporary functions (dev tests)
 */

//* Default values
const importFakeUsers = async (req, res) => {
  UserModel.insertMany(fakeUsers)
    .then((data) => {
      res.status(200).send({ message: 'Fake users added', data: data })
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'An error has occurred', error: err.message })
      return
    })
}

//! Delete all users
const deleteAllUsers = async (req, res) => {
  await UserModel.deleteMany({})
  res.status(200).send({ message: 'Users deleted' })
}

export default {
  login,
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUserById,
  importFakeUsers,
  deleteAllUsers,
}
