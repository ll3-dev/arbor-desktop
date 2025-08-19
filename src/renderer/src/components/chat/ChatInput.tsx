import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'
import { KeyboardEvent } from 'react'

interface ChatInputProps {
  userQuery: string
  setUserQuery: (query: string) => void
  onSend: () => void
  isLoading?: boolean
}

export function ChatInput({ userQuery, setUserQuery, onSend, isLoading }: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="border-t p-4">
      <div className="max-w-3xl mx-auto flex gap-2">
        <Input
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Button onClick={onSend} disabled={isLoading || !userQuery.trim()}>
          Send
        </Button>
      </div>
    </div>
  )
}
