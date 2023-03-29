import mercurius from 'mercurius'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getOwnersByPets, getPets } from '../lib/db.js'

const typeDefs = `
  type Query {
    add(x: Int, y: Int): Int
    pets: [Pet]
  }
  type Person {
    name: String!
  }
  type Pet {
    name: String!
    owner: Person!
  }
`

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y,
    pets: (_, __, context) => getPets(context.app.pg)
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const loaders = {
  Pet: {
    owner: async (queries, context) => {
      const owners = await getOwnersByPets(
        context.app.pg,
        queries.map(({ obj }) => obj.name)
      )
      return queries.map(({ obj }) =>
        owners.find(owner => owner.id === obj.owner)
      )
    }
  }
}

export default async function (fastify, opts, next) {
  fastify.register(mercurius, {
    schema,
    loaders,
    graphiql: true
  })

  next()
}
