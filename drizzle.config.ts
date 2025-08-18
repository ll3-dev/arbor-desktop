import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/main/database/schema.ts',
  driver: 'pglite',
  dialect: 'postgresql',
  casing: 'snake_case',
  out: './drizzle',
  dbCredentials: {
    url: 'arbor.db'
  },
  strict: true
})
