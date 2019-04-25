export default {
  comment: {
    subscribe(p, { postId }, { prisma }, info) {
      return prisma.subscription.comment({
        where: { node: { post: { id: postId } } },
      }, info)
    }
  },
  post: {
    subscribe(p, a, { prisma }, info) {
      return prisma.subscription.post({
        where: { node: { published: true } },
      }, info)
    }
  }
}
