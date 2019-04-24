import uuidv4 from 'uuid/v4'

export default {
  createUser(_, args, { db }) {
    const emailTaken = db.users.some(({ email }) =>
      email == args.data.email
    )
    if (emailTaken) {
      throw new Error('Email taken.')
    }
    const user = {
      id: uuidv4(),
      ...args.data,
    }
    db.users.push(user);
    return user;
  },
  deleteUser(_, args, { db }) {
    const userIdx = db.users.findIndex(({ id }) =>
      id == args.id 
    )
    if (userIdx == -1) {
      throw new Error('User not found.')
    }
    // remove user
    const deletedUsers = db.users.splice(userIdx, 1)
    // remove users posts
    db.posts = db.posts.filter(({ author, id }) => {
      const match = author == args.id
      if (match) {
        // remove posts comments
        db.comments = db.comments.filter(({ post }) =>
          post != id
        )
      }
      return !match
    })
    // remove users comments
    db.comments = db.comments.filter(({ author }) => author != args.id)
    return deletedUsers[0]
  },
  updateUser(_, args, { db }) {
    const { data } = args
    const user = db.users.find(({ id }) => id == args.id)
    if (!user) {
      throw new Error('User not found.')
    }
    if (typeof data.email == 'string') {
      const emailTaken = db.users.some(({ email }) => data.email == email)
      if (emailTaken) {
        throw new Error('Email in use.')
      }
      user.email = data.email
    }
    if (typeof data.name == 'string') {
      user.name = data.name
    }
    if (typeof data.age != 'undefined') {
      user.age = data.age
    }
    return user
  },
  createPost(_, args, { db, pubsub }) {
    const userExists = db.users.some(({ id }) =>
      id == args.data.author
    )
    if (!userExists) {
      throw new Error('User not found.')
    }
    const post = {
      id: uuidv4(),
      ...args.data,
    }
    db.posts.push(post);
    // publish changes
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        }
      })
    }
    return post;
  },
  deletePost(_, args, { db, pubsub }) {
    const postIdx = db.posts.findIndex(({ id }) => id == args.id)
    if (postIdx == -1) {
      throw new Error('User not found.')
    }
    // remove post
    const [post] = db.posts.splice(postIdx, 1)
    // remove posts comments
    db.comments = db.comments.filter(({ post }) => post != args.id)
    // publish changes
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post,
        }
      })
    }
    return post
  },
  updatePost(_, args, { db, pubsub }) {
    const { data } = args
    const post = db.posts.find(({ id }) => id == args.id)
    const origPost = { ...post }
    if (!post) {
      throw new Error('Post not found.')
    }
    // update fields
    if (typeof data.title == 'string') {
      post.title = data.title
    }
    if (typeof data.body == 'string') {
      post.body = data.body
    }
    if (typeof data.published == 'boolean') {
      post.published = data.published
    }
    // publish changes
    const wasDeleted = origPost.published && !post.published
    const wasCreated = !origPost.published && post.published
    if (wasDeleted || wasCreated || post.published) {
      pubsub.publish('post', {
        post: {
          mutation: (
            wasDeleted ? 'DELETED'
            : wasCreated ? 'CREATED'
            : 'UPDATED'
          ),
          data: wasDeleted ? origPost : post,
        }
      })
    }
    return post
  },
  createComment(_, args, { db, pubsub }) {
    const userExists = db.users.some(({ id }) => id == args.data.author)
    if (!userExists) {
      throw new Error('User not found.')
    }
    const post = db.posts.find(({ id }) => id == args.data.post)
    if (!post || !post.published) {
      throw new Error('Post not found.')
    }
    const comment = {
      id: uuidv4(),
      ...args.data,
    }
    db.comments.push(comment)
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      }
    })
    return comment
  },
  deleteComment(_, args, { db, pubsub }) {
    const commentIdx = db.comments.findIndex(({ id }) => id == args.id)
    if (commentIdx == -1) {
      throw new Error('Comment not found.')
    }
    // remove comment
    const [comment] = db.comments.splice(commentIdx, 1)
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment,
      }
    })
    return comment
  },
  updateComment(_, args, { db, pubsub }) {
    const { data } = args
    const comment = db.comments.find(({ id }) => id == args.id)
    if (!comment) {
      throw new Error('Comment not found.')
    }
    if (typeof data.text == 'string') {
      comment.text = data.text
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      }
    })
    return comment
  }
}
