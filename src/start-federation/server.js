import { createGateway } from './index.js'
import { createService } from './service.js'
import { service1 } from './service1.js'
import { service2 } from './service2.js'

async function start() {
  await createService(4001, service1.schema, service1.resolvers)
  await createService(4002, service2.schema, service2.resolvers)

  const gateway = createGateway()
  try {
    gateway.listen({ port: 4000 })
  } catch (err) {
    gateway.log.error(err)
    process.exit(1)
  }
}
start()
