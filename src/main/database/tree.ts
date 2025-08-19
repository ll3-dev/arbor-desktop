import { db } from '@main/database'
import { tree } from '@main/database/schema'
import { eq } from 'drizzle-orm'

export const getTree = async (treeId: number) => {
  return db.select().from(tree).where(eq(tree.id, treeId)).limit(1)
}

export const getAllTrees = async () => {
  return db.select().from(tree)
}

export const createTree = async (title: string) => {
  return db.insert(tree).values({ title }).returning()
}

export const deleteTree = async (treeId: number) => {
  return db.delete(tree).where(eq(tree.id, treeId)).returning()
}

export const updateTree = async (treeId: number, title: string) => {
  return db.update(tree).set({ title }).where(eq(tree.id, treeId)).returning()
}
