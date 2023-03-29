import envSchema from 'env-schema'
import { Type } from '@sinclair/typebox'
import { join } from 'desm'

export const config = envSchema({
  schema: Type.Strict(
    Type.Object({
      PORT: Type.Number({ default: 3000 }),
      PG_CONNECTION_STRING: Type.String()
    })
  ),
  dotenv: { path: join(import.meta.url, '../.env') }
})
