import mercurius from 'mercurius'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getOwnersByPets, getPets } from '../lib/db.js'

const typeDefs = `
  type Query {
    add(x: Int, y: Int): Int
    pets: [Pet]
    findUser(id: Int!): User
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
    id: Int!
    name: String!
  locale: String!
  }
`

const Users = [
  { id: 1, name: 'John Doe', locale: 'en' },
  { id: 2, name: 'Jane', locale: 'it' },
  { id: 3, name: 'Liam', locale: 'en' }
]

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y,
    pets: (_, __, context) => getPets(context.app.pg),
    findUser: (_, { id }) => {
      const user = Users.find(user => user.id === id)
      if (!user)
        throw new mercurius.ErrorWithProps('Invalid user Id', {
          code: 'USER_ID_INVALID',
          id
        })
      return user
    },
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
