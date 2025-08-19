import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'
import { sql } from 'drizzle-orm'

const client = createClient({
  url: 'file:arbor.db',
  offline: true
})

export const db = drizzle({ schema, client })

// init embedding index
await db
  .run(
    sql`
  CREATE INDEX IF NOT EXISTS chunks_index
  ON chunks(embedding)
`
  )
  .catch(console.error)
