import { db } from '@main/database'
import { chats, chunks, tree } from '@main/database/schema'
import { eq, inArray, sql } from 'drizzle-orm'

export const createChat = async (
  treeId: number,
  data: Omit<typeof chats.$inferInsert, 'treeId' | 'createdAt'>
) =>
  db
    .insert(chats)
    .values({ treeId, ...data })
    .returning()

export const getChat = async (id: number) => db.select().from(chats).where(eq(chats.id, id)).limit(1)

export const getRecentChatHistory = async (chatId: number, limit = 3) => {
  const recursiveQuery = sql`
    WITH RECURSIVE current_branch_nodes (id) AS (
      SELECT id FROM chats WHERE id = ${chatId}
      UNION ALL
      SELECT n.parentId FROM chats n
      JOIN current_branch_nodes cbn ON n.id = cbn.id
      WHERE n.parentId IS NOT NULL
    )
    SELECT * FROM current_branch_nodes LIMIT ${limit};
  `
  const result = await db.run(recursiveQuery)
  return result.rows.map((r) => {
    return {
      id: r.id as number,
      treeId: r.treeId as number,
      parentId: r.parentId as number | null,
      userQuery: r.userQuery as string,
      aiResponse: r.aiResponse as string,
      createdAt: r.createdAt as number,
      updatedAt: r.updatedAt as number
    }
  })
}

const getNodeIdsInScope = async (
  treeId: number,
  chatId: number,
  searchScope: 'branch' | 'tree'
) => {
  if (searchScope === 'tree') {
    const results = await db
      .select({ chatId: chats.id })
      .from(chats)
      .where(sql`${chats.treeId} = ${treeId}`)
    return results.map((r) => r.chatId)
  }

  const recursiveQuery = sql`
        WITH RECURSIVE current_branch_nodes (id) AS (
            SELECT ${chats.id} FROM ${chats} WHERE ${chats.id} = ${chatId}
            UNION ALL
            SELECT n.parentId FROM ${chats} n JOIN current_branch_nodes cbn ON n.id = cbn.id WHERE n.parentId IS NOT NULL
        )
        SELECT id FROM current_branch_nodes;
    `
  const results = await db.run(recursiveQuery)
  return results.rows.map((r) => r.id as number)
}

export const getSimilarChunks = async (
  treeId: number,
  chatId: number,
  embedding: Float32Array,
  limit = 3,
  searchScope: 'branch' | 'tree' = 'branch'
) => {
  const targetNodeIds = await getNodeIdsInScope(treeId, chatId, searchScope)

  if (targetNodeIds.length === 0) {
    console.warn('No nodes found in the current scope. Returning empty.')
    return []
  }

  return await db
    .select({
      chatId: chunks.chatId,
      content: chunks.content,
      distance: sql`distnace`
    })
    .from(
      sql`vector_top_k('chunks_index', vector32(${JSON.stringify(Array.from(embedding))}), ${limit})`
    )
    .leftJoin(chunks, inArray(chunks.chatId, targetNodeIds))
}

export const getAllChats = async (treeId: number) =>
  db.select().from(chats).where(eq(chats.treeId, treeId)).orderBy(chats.createdAt)

export const newChat = async (title: string) =>
  db
    .insert(tree)
    .values({ title })
    .returning()
    .then((result) => result[0])
