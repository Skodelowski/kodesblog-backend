// ==========
// Post Model
// ==========

import mongoose from 'mongoose'
const { Schema, model } = mongoose

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'users' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: null },
    date: { type: Date, default: Date.now() },
    category: { type: Schema.Types.ObjectId, default: null },
    tag: { type: String },
    likeCount: { type: Number, default: 0 },
  },
  { minimize: true },
)

const PostModel = model('posts', PostSchema)

export default PostModel
