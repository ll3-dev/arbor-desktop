import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@renderer/router'
import z from 'zod'

type Message = {
  id: string
  content: string
  role: 'user' | 'assistant'
}

const productSearchSchema = z.object({
  treeId: z.number().min(1).optional()
})

export const Route = createFileRoute('/chat/')({
  component: ChatComponent,
  validateSearch: (search) => productSearchSchema.parse(search)
})

function ChatComponent() {
  const { treeId } = Route.useSearch()

  const { data: existingChat } = useQuery(trpc.chat.getChat.queryOptions({}))

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>(existingChat?.messages || [])

  const createChatMutation = trpc.chat.create.useMutation()
  const addMessageMutation = trpc.chat.addMessage.useMutation()

  const handleSend = async () => {
    if (!message.trim()) return

    // Add user message to UI immediately
    const userMessage: Message = { id: Date.now().toString(), content: message, role: 'user' }
    setMessages((prev) => [...prev, userMessage])

    // Clear input
    setMessage('')

    try {
      let treeIdNum = Number(treeId)
      if (!treeIdNum || treeIdNum <= 0) {
        // Create new chat if it doesn't exist
        const newChat = await createChatMutation.mutateAsync({
          title: message.substring(0, 30),
          userQuery: message
        })
        treeIdNum = newChat.id

        // Update the URL with the new chat ID
        Route.useNavigate()({ search: { treeId: treeIdNum } })
      }

      // Add user message to database
      await addMessageMutation.mutateAsync({ treeId: treeIdNum, content: message, role: 'user' })

      // Get AI response (in a real app, this would be a streaming response)
      // For now we'll simulate a response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated response to: "${message}"`,
        role: 'assistant'
      }

      // Add AI message to UI
      setMessages((prev) => [...prev, aiMessage])

      // Add AI message to database
      await addMessageMutation.mutateAsync({
        treeId: treeIdNum,
        content: aiMessage.content,
        role: 'assistant'
      })
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove the user message if there was an error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                  : 'bg-secondary mr-auto max-w-[80%]'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  )
}
