import fastify from 'fastify'
import mercurius from 'mercurius'
import postgres from '@fastify/postgres'
import { schema, loaders } from './plugins/graphql.js'

async function registerGraphqlHooks(app) {
  await app.ready()
  app.graphql.addHook('preParsing', async (schema, document, context) => {
    app.log.info('preParsing')
  })
  app.graphql.addHook('preValidation', async (schema, document, context) => {
    app.log.info('preValidation')
  })
  app.graphql.addHook(
    'preExecution',
    async (schema, document, context, variables) => {
      app.log.info('preExecution')
      return {
        schema,
        document,
        context,
        variables,
        errors: [new Error('foo')]
      }
    }
  )
  app.graphql.addHook('onResolution', async (schema, document, context) => {
    app.log.info('onResolution')
  })
}

export function createServer({ config }) {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      }
    }
  })

  app.log.info('Starting server...')

  app.register(postgres, {
    connectionString: config.PG_CONNECTION_STRING
  })
  app.register(mercurius, {
    schema,
    loaders,
    graphiql: true,
    context: () => ({ locale: 'en' })
  })

  registerGraphqlHooks(app)

  return app
}
