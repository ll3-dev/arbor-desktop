import { llm } from '@main/actions/llm'
import { createChat as createChatAtDB, newChat } from '@main/database/chat'

export const createNewChat = (title: string) => newChat(title)

export const createChat = async (treeId: number, userQuery: string) => {
  const { text: aiResponse } = await llm.invoke(userQuery)
  const chat = await createChatAtDB(treeId, {
    userQuery,
    aiResponse
  })

  return chat
}
