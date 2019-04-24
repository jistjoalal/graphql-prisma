export default {
  users(_, { query }, { prisma }, info) {
    const opArgs = {}

    if (query) {
      opArgs.where = {
        OR: [
          { name_contains: query },
          { email_contains: query },
        ],
      }
    }

    return prisma.query.users(opArgs, info)
  },
  posts(_, { query }, { prisma }, info) {
    const opArgs = {}

    if (query) {
      opArgs.where = {
        OR: [
          { title_contains: query },
          { body_contains: query },
        ],
      }
    }

    return prisma.query.posts(opArgs, info)
  },
  comments(_, args, { prisma }, info) {
    return prisma.query.comments(null, info)
  },
  me() {
    return {
      id: '123',
      name: 'Mike',
      email: 'mike@g.com',
    }
  },
  post() {
    return {
      id: '234',
      title: 'guide to swag',
      body: 'step 1 wear a top hat like Abe Lincoln',
      published: true,
    }
  }
}
