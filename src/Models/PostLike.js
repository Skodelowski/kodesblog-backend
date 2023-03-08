// ==========
// Post Model
// ==========

import mongoose from 'mongoose'
const { Schema, model } = mongoose

const PostLikeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  post: { type: Schema.Types.ObjectId, ref: 'posts' },
})

const PostLikeModel = model('postlike', PostLikeSchema)

export default PostLikeModel
