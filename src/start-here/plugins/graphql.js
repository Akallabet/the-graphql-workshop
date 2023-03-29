import mercurius from 'mercurius'
import { makeExecutableSchema } from '@graphql-tools/schema'

const pets = [{ name: 'Fido' }, { name: 'Rex' }]
const owners = { Fido: { name: 'John' }, Rex: { name: 'Jane' } }

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
    pets: async () => pets
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const loaders = {
  Pet: {
    owner: async queries => {
      return queries.map(({ obj }) => owners[obj.name])
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
