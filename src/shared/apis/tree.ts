import { publicProcedure, router } from '@main/actions/trpc'
import { createTree, getAllTrees, getTree } from '@main/database/tree'
import z from 'zod'

export const treeRouter = router({
  getTree: publicProcedure.input(z.object({ treeId: z.number() })).query(async ({ input }) => {
    const { treeId } = input
    return getTree(treeId)
  }),
  getAllTrees: publicProcedure.query(async () => {
    return getAllTrees()
  }),
  createTree: publicProcedure.input(z.object({ title: z.string() })).mutation(async ({ input }) => {
    const { title } = input
    return createTree(title)
  })
})
