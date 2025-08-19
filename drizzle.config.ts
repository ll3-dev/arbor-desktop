import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/main/database/schema.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  out: './drizzle',
  dbCredentials: {
    url: 'arbor.db'
  },
  strict: true
})
