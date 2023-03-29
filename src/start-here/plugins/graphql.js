import mercurius from 'mercurius'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getOwnersByPets, getPets } from '../lib/db.js'

const typeDefs = `
  type Query {
    add(x: Int, y: Int): Int
    pets: [Pet]
    getUserByLocale: User
  }
  type Person {
    name: String!
  }
  type Pet {
    name: String!
    owner: Person!
  }
  type User {
    name: String!
  locale: String!
  }
`
const Users = [
  { name: 'John Doe', locale: 'en' },
  { name: 'Jane', locale: 'it' },
  { name: 'Liam', locale: 'en' }
]

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y,
    pets: (_, __, context) => getPets(context.app.pg),
    getUserByLocale: (_, __, context) =>
      Users.find(user => user.locale === context.locale)
  }
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })

export const loaders = {
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

export default function (fastify, opts, next) {
  fastify.register(mercurius, {
    schema,
    loaders,
    graphiql: true,
    context: () => ({ locale: 'en' })
  })

  next()
}
