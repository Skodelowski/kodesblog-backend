// ==========
// Image Model
// ==========

import mongoose from 'mongoose'
const { Schema, model } = mongoose

const ImageSchema = new Schema({
  name: String,
  description: String,
  img: {
    data: Buffer,
    contentType: String
  }
})

const ImageModel = model('images', ImageSchema)

export default ImageModel
