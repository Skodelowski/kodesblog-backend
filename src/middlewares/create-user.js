//* First checking of datas sent (also checked by the User Model)
export default async (req, res, next) => {
  const { gender, firstname, lastname, email, photo, category } = req.body

  let errorList = []

  // Gender
  if (!gender || gender === '')
    errorList.push({ input: 'Gender', message: 'Gender is required' })

  // Firstname
  if (!firstname)
    errorList.push({ input: 'Firstname', message: 'Firstname is required' })
  if (!firstname.match(new RegExp('^[A-zÀ-ú-s]*$')))
    errorList.push({
      input: 'Firstname',
      message: 'Firstname : invalid format.',
    })

  // Lastname
  if (!lastname)
    errorList.push({ input: 'Lastname', message: 'Lastname is required' })
  if (!lastname.match(new RegExp('^[A-zÀ-ú-s]*$')))
    errorList.push({
      input: 'Lastname',
      message: 'Lastname : invalid format.',
    })

  // Email
  if (!email) errorList.push({ input: 'Email', message: 'Email is required' })
  if (!email.match(new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)))
    errorList.push({ input: 'Email', message: 'Email : invalid format' })

  // Category
  if (!category)
    errorList.push({ input: 'Category', message: 'Category is required' })
  if (!['JS', 'PHP'].includes(category))
    errorList.push({
      input: 'Category',
      message: 'User category must be "JS" or "PHP".',
    })

  if (errorList.length > 0) {
    return res
      .status(401)
      .send({ message: 'Validation error.', errors: errorList })
  } else {
    next()
  }
}
