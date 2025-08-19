import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpc } from '@renderer/router'
import { ChatMessage } from '@renderer/components/chat/ChatMessage'
import { ChatInput } from '@renderer/components/chat/ChatInput'

interface ChatViewProps {
  treeId: number
  messages: Array<{
    id: number
    role: 'user' | 'agent'
    treeId: number
    content: string
  }>
}

export function ChatView({ treeId, messages }: ChatViewProps) {
  const [userQuery, setUserQuery] = useState('')
  const queryClient = useQueryClient()
  const { mutate: createChat, isPending: isCreating } = useMutation(
    trpc.chat.createChat.mutationOptions()
  )

  const handleSend = async () => {
    if (!userQuery.trim()) return

    createChat(
      {
        treeId,
        userQuery
      },
      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: trpc.chat.getAllChats.queryKey({ treeId })
          })
          setUserQuery('')
        }
      }
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages?.map((message) => (
            <ChatMessage key={message.id} role={message.role} content={message.content} />
          ))}
        </div>
      </div>
      <ChatInput
        userQuery={userQuery}
        setUserQuery={setUserQuery}
        onSend={handleSend}
        isLoading={isCreating}
      />
    </div>
  )
}
