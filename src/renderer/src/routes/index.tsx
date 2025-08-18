import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@renderer/router'

export const Route = createFileRoute('/')({
  component: HomeComponent
})

function HomeComponent() {
  const { data: chats = [] } = useQuery(trpc.chat.getAllChats.queryOptions({ treeId: 'default' }))

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Chat History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chats.map((chat) => (
          <Card key={chat.chatId} className="flex flex-col">
            <CardHeader>
              <CardTitle>{chat.treeId || `Chat ${chat.chatId}`}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                {chat.aiResponse?.length || 0} messages
              </p>
              <Link to="/chat" search={{ chatId: chat.chatId }}>
                <Button variant="outline" className="w-full">
                  Continue Chat
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        <Card className="flex flex-col border-dashed border-2">
          <CardContent className="flex-1 flex items-center justify-center">
            <Link to="/chat">
              <Button variant="default" className="w-full">
                Start New Chat
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
