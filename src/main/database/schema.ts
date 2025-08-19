import { relations, sql } from 'drizzle-orm'
import { AnySQLiteColumn, customType } from 'drizzle-orm/sqlite-core'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

const float32Array = customType<{
  data: number[]
  config: { dimensions: number }
  configRequired: true
  driverData: Uint8Array
}>({
  dataType(config) {
    return `F32_BLOB(${config.dimensions})`
  },
  fromDriver(value: Uint8Array) {
    return Array.from(new Float32Array(value.buffer))
  },
  toDriver(value: number[]) {
    return sql`vector32(${JSON.stringify(value)})`
  }
})

export const keyValue = sqliteTable('key_value', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
})

export const tree = sqliteTable('tree', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull()
})

export const chats = sqliteTable('chats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  treeId: integer('tree_id')
    .notNull()
    .references(() => tree.id),
  parentId: integer('parent_id').references((): AnySQLiteColumn => chats.id),
  userQuery: text('user_query').notNull(),
  aiResponse: text('ai_response').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

export const chatsRelations = relations(chats, ({ one, many }) => ({
  tree: one(tree, {
    fields: [chats.treeId],
    references: [tree.id]
  }),
  chunks: many(chunks),
  parent: one(chats, {
    fields: [chats.parentId],
    references: [chats.id],
    relationName: 'parent_child_relation'
  }),
  children: many(chats, {
    relationName: 'parent_child_relation'
  })
}))

export const chunks = sqliteTable('chunks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  chatId: integer('chat_id')
    .notNull()
    .references(() => chats.id),
  content: text('content').notNull(),
  embedding: float32Array('embedding', { dimensions: 1024 })
})

export const chunksRelations = relations(chunks, ({ one }) => ({
  node: one(chats, {
    fields: [chunks.chatId],
    references: [chats.id]
  })
}))
