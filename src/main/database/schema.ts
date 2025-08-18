import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  AnyPgColumn,
  index,
  integer,
  serial,
  text,
  timestamp,
  vector
} from 'drizzle-orm/pg-core'

export const keyValue = pgTable('key_value', {
  key: serial().primaryKey(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }).default(sql`null`)
})

export const tree = pgTable('tree', {
  id: serial().primaryKey(),
  title: text('title').notNull()
})

export const chats = pgTable('chats', {
  id: serial().primaryKey(),
  treeId: integer('tree_id')
    .notNull()
    .references(() => tree.id),
  parentId: integer('parent_id').references((): AnyPgColumn => chats.id),
  userQuery: text('user_query').notNull(),
  aiResponse: text('ai_response').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`)
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

export const chunks = pgTable(
  'chunks',
  {
    id: serial().primaryKey(),
    chatId: integer('chat_id')
      .notNull()
      .references(() => chats.id),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1024 })
  },
  (table) => [index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops'))]
)

export const chunksRelations = relations(chunks, ({ one }) => ({
  node: one(chats, {
    fields: [chunks.chatId],
    references: [chats.id]
  })
}))
