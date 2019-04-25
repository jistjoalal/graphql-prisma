import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://192.168.99.100:4466',
  secret: 'supersecrettext',
})

export { prisma as default }

// prisma.exists.Comment({
//   id: 'cjut3k5k6004n0739zltacv7q',
// }).then(exists => console.log(exists))

// const createPostForUser = async (authorId, data) => {

//   const userExists = await prisma.exists.User({ id: authorId })
//   if (!userExists) throw new Error('User not found.')

//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authorId,
//         }
//       }
//     }
//   }, '{ author { id name email posts { id title published } } }')

//   return post.author
// }

// createPostForUser('cjut2owlr001p0739ni9brfsc', {
//   title: 'great books to read',
//   body: 'the war of art',
//   published: true,
// }).then(user => {
//   console.log(JSON.stringify(user, undefined, 2))
// })
// .catch(console.log)

// const updatePostForUser = async (postId, data) => {

//   const postExists = await prisma.exists.Post({ id: postId })
//   if (!postExists) throw new Error('Post not found.')

//   const post = await prisma.mutation.updatePost({
//     where: {
//       id: postId,
//     },
//     data,
//   }, '{ author { id name email posts { id title published } } }')

//   return post.author
// }

// updatePostForUser('cjuuh3m24000f0739ycae832b', {
//   title: 'santa isnt real',
// })
// .then(user => {
//   console.log(JSON.stringify(user, undefined, 2))
// })
// .catch(console.log)
