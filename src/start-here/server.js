import { createServer } from './index.js'
import { config } from './lib/config.js'

async function start() {
  const app = createServer({ config })
  try {
    app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
