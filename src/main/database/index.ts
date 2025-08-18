import { drizzle } from 'drizzle-orm/pglite'
import { PGlite } from '@electric-sql/pglite'

import { vector } from '@electric-sql/pglite/vector'
import * as schema from './schema'

const client = new PGlite({
  database: 'arbor.db',
  extensions: {
    vector
  }
})

export const appDb = drizzle({ schema, client })
