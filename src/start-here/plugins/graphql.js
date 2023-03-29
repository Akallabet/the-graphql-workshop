import mercurius from 'mercurius'

const schema = `
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

const pets = [{ name: 'Fido' }, { name: 'Rex' }]
const owners = { Fido: { name: 'John' }, Rex: { name: 'Jane' } }

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y,
    pets: async () => pets
  }
}

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
    resolvers,
    loaders,
    graphiql: true
  })

  next()
}
