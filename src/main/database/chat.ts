import { appDb } from '@main/database'
import { chats, chunks } from '@main/database/schema'
import { eq, inArray, sql } from 'drizzle-orm'

export const createChat = async (
  treeId: number,
  data: Omit<typeof chats.$inferInsert, 'treeId' | 'createdAt'>
) =>
  appDb
    .insert(chats)
    .values({ treeId, ...data })
    .returning()

export const getChat = async (id: number) =>
  appDb.select().from(chats).where(eq(chats.id, id)).limit(1)

// TODO: rCTE
export const getRecentChatHistory = async (chatId: number, limit = 3) => {
  const result = await appDb.execute<typeof chats.$inferSelect>(`
     WITH RECURSIVE current_branch_nodes (node_id) AS (
            SELECT ${chats.id} FROM ${chats} WHERE ${chats.id} = ${chatId}
            UNION ALL
            SELECT n.parentId FROM ${chats} n JOIN current_branch_nodes cbn ON n.id = cbn.node_id WHERE n.parentId IS NOT NULL
        )
        SELECT * FROM current_branch_nodes LIMIT ${limit};
    `)
  return result.rows
}

const getNodeIdsInScope = async (
  treeId: number,
  chatId: number,
  searchScope: 'branch' | 'tree'
) => {
  if (searchScope === 'tree') {
    const results = await appDb
      .select({ chatId: chats.id })
      .from(chats)
      .where(sql`${chats.treeId} = ${treeId}`)
    return results.map((r) => r.chatId)
  }

  const recursiveQuery = sql`
        WITH RECURSIVE current_branch_nodes (node_id) AS (
            SELECT ${chats.id} FROM ${chats} WHERE ${chats.id} = ${chatId}
            UNION ALL
            SELECT n.parentId FROM ${chats} n JOIN current_branch_nodes cbn ON n.id = cbn.node_id WHERE n.parentId IS NOT NULL
        )
        SELECT node_id FROM current_branch_nodes;
    `
  const results = await appDb.execute<{ node_id: number }>(recursiveQuery)
  return results.rows.map((r) => r.node_id)
}

export const getSimilarChunks = async (
  treeId: number,
  chatId: number,
  embeddingVector: Float32Array,
  limit = 3,
  searchScope: 'branch' | 'tree' = 'branch'
) => {
  const targetNodeIds = await getNodeIdsInScope(treeId, chatId, searchScope)

  if (targetNodeIds.length === 0) {
    console.warn('No nodes found in the current scope. Returning empty.')
    return []
  }

  return appDb
    .select({
      chunkId: chunks.id,
      chatId: chunks.chatId,
      content: chunks.content,
      distance: sql<number>`vector_distance_cos_vss(${chunks.embedding}, ${embeddingVector.buffer})`
    })
    .from(chunks)
    .where(inArray(chunks.chatId, targetNodeIds))
    .orderBy(sql`vector_distance_cos_vss(${chunks.embedding}, ${embeddingVector.buffer})`)
    .limit(limit)
}

export const getAllChats = async (treeId: number) =>
  appDb.select().from(chats).where(eq(chats.treeId, treeId)).orderBy(chats.createdAt)
