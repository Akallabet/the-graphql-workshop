import fastify from 'fastify'
import autoload from '@fastify/autoload'
import postgres from '@fastify/postgres'
import { join } from 'desm'

export function createServer({ config }) {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      }
    }
  })
  app.log.info(config)

  app.log.info('Starting server...')

  app.register(postgres, {
    connectionString: config.PG_CONNECTION_STRING
  })
  app.register(autoload, {
    dir: join(import.meta.url, 'plugins'),
    options: config
  })

  return app
}
