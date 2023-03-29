import mercurius from 'mercurius'

const schema = `
  type Query {
    add(x: Int, y: Int): Int
  }
`

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y
  }
}

export default async function (fastify, opts, next) {
  fastify.register(mercurius, {
    schema,
    resolvers,
    graphiql: true
  })

  next()
}
