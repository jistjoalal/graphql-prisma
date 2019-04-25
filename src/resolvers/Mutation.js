export default {
  async createUser(_, { data }, { prisma }, info) {
    return await prisma.mutation.createUser({ data }, info)
  },
  async deleteUser(_, { id }, { prisma }, info) {
    return await prisma.mutation.deleteUser({ where: { id } }, info)
  },
  async updateUser(_, { id, data }, { prisma }, info) {
    return await prisma.mutation.updateUser({ where: { id }, data }, info)
  },
  async createPost(_, { data }, { prisma }, info) {
    return await prisma.mutation.createPost({
      data: {
        title: data.title,
        body: data.body,
        published: data.published,
        author: { connect: { id: data.author } },
      }
    }, info)
  },
  async deletePost(_, { id }, { prisma }, info) {
    return await prisma.mutation.deletePost({ where: { id } }, info)
  },
  async updatePost(_, { id, data }, { prisma }, info) {
    return await prisma.mutation.updatePost({ where: { id }, data }, info)
  },
  async createComment(_, { data }, { prisma }, info) {
    return await prisma.mutation.createComment({
      data: {
        text: data.text,
        author: { connect: { id: data.author } },
        post: { connect: { id: data.post } },
      }
    }, info)
  },
  async deleteComment(_, { id }, { prisma }, info) {
    return await prisma.mutation.deleteComment({ where: { id } }, info)
  },
  async updateComment(_, { id, data }, { prisma }, info) {
    return await prisma.mutation.updateComment({ where: { id }, data }, info)
  }
}
