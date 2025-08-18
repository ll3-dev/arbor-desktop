import { appDb } from '@main/database'
import { tree } from '@main/database/schema'
import { eq } from 'drizzle-orm'

export const getTree = async (treeId: number) => {
  return appDb.select().from(tree).where(eq(tree.treeId, treeId)).limit(1)
}

export const getAllTrees = async () => {
  return appDb.select().from(tree)
}

export const createTree = async (title: string) => {
  return appDb.insert(tree).values({ title }).returning()
}
