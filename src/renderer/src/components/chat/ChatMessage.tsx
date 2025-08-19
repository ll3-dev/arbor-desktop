interface ChatMessageProps {
  role: 'user' | 'agent'
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      className={`p-4 rounded-lg ${
        role === 'user'
          ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
          : 'bg-secondary mr-auto max-w-[80%]'
      }`}
    >
      {content}
    </div>
  )
}
