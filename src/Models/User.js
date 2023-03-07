// ==========
// User Model
// ==========

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    gender: { type: String, required: true },
    firstname: {
      type: String,
      required: [true, 'Firstname is required.'],
      minLength: [2, 'Firstname must have at least 2 characters.'],
      maxLength: [50, 'Firstname must have at most 50 characters.'],
      match: [/^[A-zÀ-ú-\s]*$/, 'Please enter a valid firstname.'],
    },
    lastname: {
      type: String,
      required: [true, 'Lastname is required.'],
      minLength: [2, 'Lastname must have at least 2 characters.'],
      maxLength: [50, 'Lastname must have at most 50 characters.'],
      match: [/^[A-zÀ-ú-\s]*$/, 'Please enter a valid lastname.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      index: { unique: true },
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid mail.',
      ],
    },
    password: {
      type: String,
      set: (p) => (p === '' ? undefined : p), // Case of updating the user without changing the password
    },
    photo: {
      type: String,
    },
    category: {
      type: String,
      default: 'JS',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { minimize: true },
) // minimize removes empty objects

// Password & Hash (bcrypt)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
  } catch (err) {
    next(err)
  }
})

UserSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) return next()
  try {
    this._update.password = await bcrypt.hash(this._update.password, 10)
  } catch (err) {
    console.log(err)
  }
  next()
})

UserSchema.pre('insertMany', async function (next, users) {
  try {
    for (const user of users) {
      user.password = await bcrypt.hash(user.password, 10)
    }
  } catch (err) {
    console.log(err)
  }
  next()
})

UserSchema.methods.verifyPassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

const UserModel = model('users', UserSchema)

export default UserModel
