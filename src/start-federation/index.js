import fastify from 'fastify'
import mercuriusGateway from '@mercuriusjs/gateway'

export function createGateway() {
  const app = fastify({ logger: { transport: { target: 'pino-pretty' } } })
  app.register(mercuriusGateway, {
    graphiql: true,
    gateway: {
      services: [
        {
          name: 'user',
          url: 'http://localhost:4001/graphql'
        },
        {
          name: 'post',
          url: 'http://localhost:4002/graphql'
        }
      ]
    },
    pollingInterval: 10000
  })
  return app
}
