import { publicProcedure, router } from '@main/actions/trpc'
import { getAllChats, getChat } from '@main/database/chat'
import { z } from 'zod'

export const chatRouter = router({
  getAllChats: publicProcedure.input(z.object({ treeId: z.number() })).query(async ({ input }) => {
    const { treeId } = input
    return getAllChats(treeId)
  }),
  getChat: publicProcedure.input(z.object({ chatId: z.number() })).query(async ({ input }) => {
    const { chatId } = input
    return getChat(chatId)
  })
})
