import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { trpc } from '@renderer/router'
import z from 'zod'
import { ChatView } from '@renderer/components/chat/ChatView'

const productSearchSchema = z.object({
  treeId: z.number().min(1)
})

export const Route = createFileRoute('/chat/')({
  component: ChatComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  wrapInSuspense: true
})

function ChatComponent() {
  const { treeId } = Route.useSearch()
  const { data: allChats } = useSuspenseQuery(trpc.chat.getAllChats.queryOptions({ treeId }))

  const messages = allChats.reduce(
    (acc, chat) => {
      acc.push({
        id: chat.id,
        role: 'agent',
        treeId: chat.treeId,
        content: chat.aiResponse
      })
      acc.push({
        id: chat.id,
        role: 'user',
        treeId: chat.treeId,
        content: chat.userQuery
      })
      return acc
    },
    [] as { id: number; role: 'user' | 'agent'; treeId: number; content: string }[]
  )

  return <ChatView treeId={treeId} messages={messages} />
}
