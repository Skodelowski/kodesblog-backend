const verifyPostContent = (post, image) => {
  if (!post.title) return { error: true, message: 'Title is required.' }

  if (!post.category)
    return { error: true, message: 'Please choose a category.' }

  if (!image)
    return {
      error: true,
      message: 'Please give an image to illustrate the post.',
    }

  return { error: false }
}

export { verifyPostContent }
