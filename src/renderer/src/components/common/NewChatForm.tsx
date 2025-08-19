import { useState } from 'react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { trpc } from '@renderer/router'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

// FIXME: AppRouter 타입을 올바르게 가져와야 합니다.
// import { inferRouterOutputs } from '@trpc/react-query'
// import { AppRouter } from '@shared/type'
// type RouterOutput = inferRouterOutputs<AppRouter>
// type NewChatOutput = RouterOutput['chat']['newChat']

interface NewChatFormProps {
  onChatCreated?: (treeId: number) => void
  onCancel?: () => void
}

export function NewChatForm({ onChatCreated, onCancel }: NewChatFormProps) {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { mutate: createChat } = useMutation(trpc.chat.newChat.mutationOptions())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isLoading) return

    setIsLoading(true)
    createChat(
      {
        title: title.trim()
      },
      {
        onSuccess: (newChat) => {
          // FIXME: newChat의 타입을 명시적으로 지정해야 합니다.
          // @ts-ignore: newChat type is unknown, but we know it has an id property
          onChatCreated?.(newChat.id)
          // @ts-ignore: newChat type is unknown, but we know it has an id property
          navigate({ to: '/chat', search: { treeId: newChat.id } })
        },
        onSettled: () => {
          setIsLoading(false)
        }
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Chat Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your chat"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !title.trim()}>
          {isLoading ? 'Creating...' : 'Create Chat'}
        </Button>
      </div>
    </form>
  )
}
