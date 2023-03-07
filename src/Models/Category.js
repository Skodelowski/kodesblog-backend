// Category Model

// name (String), upperCategory (Number, ObjectID, default 0)
// ==========
// Category Model
// ==========

import mongoose from 'mongoose'
const { Schema, model } = mongoose

const CategorySchema = new Schema({
  title: { type: String, required: true, unique: true },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    default: null,
  },
  slug: { type: String, unique: true },
})

const CategoryModel = model('categories', CategorySchema)

export default CategoryModel
