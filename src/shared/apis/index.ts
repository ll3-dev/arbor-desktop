import { llmRouter } from '@shared/apis/llm'
import { chatRouter } from '@shared/apis/chat'
import { router } from '@main/actions/trpc'
import { keyValueRouter } from '@shared/apis/keyValue'

export const appRouter = router({
  kv: keyValueRouter,
  llm: llmRouter,
  chat: chatRouter
})
