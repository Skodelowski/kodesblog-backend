const verifyPasswordSecurity = (password) => {
  // Global Regex
  const regex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$',
  )

  // Detailed Regex (to get errors informations)
  const verifMinimum = new RegExp('.{8,}')
  const verifLower = new RegExp('[a-z]+')
  const verifUpper = new RegExp('[A-Z]+')
  const verifNumber = new RegExp('[0-9]+')
  const verifSpecial = new RegExp('[@$!%*?&]+')

  // Password is empty
  if (!password || password === '')
    return { error: true, message: 'Password is required.' }

  // Minimum 8 chars
  if (!password.match(verifMinimum))
    return { error: true, message: 'Password must have at least 8 characters.' }

  // At least 1 lowercase letter
  if (!password.match(verifLower))
    return {
      error: true,
      message: 'Password must have at least 1 lowercase character.',
    }

  // At least 1 capital letter
  if (!password.match(verifUpper))
    return {
      error: true,
      message: 'Password must have at least 1 uppercase character.',
    }

  // At least 1 number
  if (!password.match(verifNumber))
    return {
      error: true,
      message: 'Password must have at least 1 number.',
    }

  // At least 1 special character (@$!%*?&)
  if (!password.match(verifSpecial))
    return {
      error: true,
      message: 'Password must have at least 1 special character (@$!%*?&).',
    }

  // All good
  return { error: false, message: 'Password is valid.' }
}

export { verifyPasswordSecurity }
