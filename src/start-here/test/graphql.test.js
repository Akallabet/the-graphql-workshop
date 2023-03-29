import t from 'tap'
import { createServer } from '../index.js'

//Test the server with the sum of two numbers
t.test('sum of two numbers', async t => {
  const app = createServer({ config: {} })
  await app.ready()

  const response = await app.inject({
    method: 'POST',
    url: '/graphql',
    payload: {
      query: 'query { add(x: 2, y: 2) }'
    }
  })

  t.equal(response.statusCode, 200)
  const { data } = await response.json()

  t.equal(data.add, 4)

  t.end()
})

t.test('get pets', async t => {
  const app = createServer({ config: {} })
  await app.ready()

  const response = await app.inject({
    method: 'POST',
    url: '/graphql',
    payload: {
      query: 'query { pets { name } }'
    }
  })

  t.equal(response.statusCode, 200)
  const { data } = await response.json()

  t.equal(data.pets.length, 2)

  t.end()
})
