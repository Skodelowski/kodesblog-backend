import ImageModel from '../Models/Image.js'

//* GET/ Get all images
const getAllImages = async (req, res) => {
  ImageModel.find()
    .then((images) => {
      res.status(200).send({ message: 'Images found.', data: images })
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'An error has occurred.', error: err.message })
    })
}

export default {
  getAllImages,
}
