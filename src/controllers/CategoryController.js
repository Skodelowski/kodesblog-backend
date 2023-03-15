import CategoryModel from '../Models/Category.js'
import PostModel from '../Models/Post.js'
import baseCategories from '../../data/categories.js'

//* GET/ Get all categories
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

//* GET/ Get a category by its slug
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

//* GET/ Get a category by its id
const getCategoryById = async (req, res) => {
  const { id } = req.params
  CategoryModel.findById(id)
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

//* GET/ Get all the posts linked to a category (by slug)
const getPostsByCategory = async (req, res) => {
  const { slug } = req.params
  CategoryModel.findOne({ slug }).then((category) => {
    PostModel.find({ category: category.id })
      .then((posts) => {
        res.status(200).send({
          message: `Posts of catageory ${category.title} found.`,
          posts: posts,
        })
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: 'An error has occurred.', error: err.message })
      })
  })
}

//* POST/ Add a new category
const addCategory = async (req, res) => {
  const { title, parentCategoryTitle, slug } = req.body
  if (req.user.isAdmin) {
    // ? Improvement : make the research case-insensitive
    CategoryModel.findOne({ title: parentCategoryTitle })
      .then((parentCat) => {
        let parentId = parentCat && parentCat._id ? parentCat._id : null
        const categoryData = {
          title: title,
          parentCategory: parentId,
          slug: slug,
        }

        const Category = new CategoryModel(categoryData)

        Category.save()
          .then((cat) => {
            if (!cat.parentCategory) {
              CategoryModel.findOneAndUpdate(
                { _id: cat._id },
                { parentCategory: cat._id },
                { new: true },
              )
                .then((finalCat) => {
                  res.status(200).send({
                    message: 'Category successfully added !',
                    category: finalCat,
                  })
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      'An error has occurred in self-assignation as parent category.',
                    error: err.message,
                  })
                })
            } else {
              res.status(200).send({
                message: 'Category successfully added !',
                category: cat,
              })
            }
          })
          .catch((err) => {
            res
              .status(500)
              .send({ message: 'An error has occurred.', error: err.message })
            return
          })
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: 'An error has occurred.', error: err.message })
        return
      })
  } else {
    res.status(403).send({ message: 'Unauthorized operation. (Admin)' })
  }
}

//! DELETE/ Delete a category (Admin only)
const deleteCategory = (req, res) => {
  const { slug } = req.params
  if (req.user.isAdmin) {
    CategoryModel.findOneAndDelete({ slug })
      .then(() => {
        res.status(200).send({ message: 'Category successfully deleted.' })
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
  getCategoryById,
  getPostsByCategory,
  addCategory,
  deleteCategory,
  importCategories,
}
