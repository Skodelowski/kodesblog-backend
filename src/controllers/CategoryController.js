import CategoryModel from '../Models/Category.js'
import baseCategories from '../../data/categories.js'

const getAllCategories = async (req, res) => {
  CategoryModel.find()
    .then((categories) => {
      res.status(200).send({
        message: 'All categories',
        fullData: categories,
      })
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error', error: err.message })
    })
}

const getCategory = async (req, res) => {
  const { slug } = req.params
  CategoryModel.findOne({ slug })
    .then((cat) => {
      CategoryModel.findById(cat.parentCategory).then((parent) => {
        res
          .status(200)
          .send({ message: 'Category found !', category: cat, parent: parent })
      })
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'An error has occurred', error: err.message })
    })
}

const addCategory = async (req, res) => {
  if (req.user.isAdmin) {
    //...
  }
  res.send({ message: 'WIP' })
}

const deleteCategory = (req, res) => {
  if (req.user.isAdmin) {
    //...
  }
  res.send({ message: 'WIP' })
}

const importCategories = async (req, res) => {
  let categories = []
  // Data to send
  for (const cat of baseCategories) {
    categories.push({ title: cat.title, slug: cat.slug })
  }

  // Feeding the database
  CategoryModel.insertMany(categories)
    .then((dbCategories) => {
      let categoriesId = []
      // Read the ObjectID, data to update for parentCategory
      dbCategories.map((cat) => {
        categoriesId.push({ id: cat._id, title: cat.title })
      })
      // Updating parentCategory for each entry
      baseCategories.map((baseCat) => {
        let parentId = ''
        categoriesId.map((catId) => {
          if (catId.title === baseCat.referent) parentId = catId.id
        })

        CategoryModel.findOneAndUpdate(
          { title: baseCat.title },
          { parentCategory: parentId },
          { new: true },
        )
          .then((res) => console.log(res))
          .catch((err) => console.log(err.message))
      })

      res.status(200).send({ message: 'Categories added.' })
    })
    .catch((err) => {
      return res.status(500).send({
        message: 'An error has occurred (insert).',
        error: err.message,
      })
    })
}

export default {
  getAllCategories,
  getCategory,
  addCategory,
  deleteCategory,
  importCategories,
}
