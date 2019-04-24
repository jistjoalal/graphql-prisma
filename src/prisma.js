import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://192.168.99.100:4466'
})

// prisma.query.users(null, '{ id name posts { id title } }').then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.query.comments(null, '{ id text author { id name } }').then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.createPost({
//   data: {
//     title: 'graphql 101',
//     body: '',
//     published: false,
//     author: {
//       connect: {
//         id: "cjut2owlr001p0739ni9brfsc",
//       }
//     }
//   }
// }, '{ id title body published }').then(data => {
//   console.log(data)
//   return prisma.query.users(null, '{ id name posts { id title } }')
// }).then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// })

// update post body and mark published
// fetch all posts id title body published print to console
// confirm post got changed

prisma.mutation.updatePost({
  data: {
    body: 'this post has a new body',
    published: true,
  },
  where: {
    id: 'cjuuh7ixz000m0739p7j8a597',
  },
}, '{ id body published }').then(data => {
  console.log(data)
  return prisma.query.posts(null, '{ id title body published }')
}).then(data => {
  console.log(JSON.stringify(data, undefined, 2))
})
