import { useState } from 'react'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { trpc } from '@renderer/router'
import { NewChatForm } from '@renderer/components/NewChatForm'

export const Route = createFileRoute('/')({
  component: HomeComponent,
  wrapInSuspense: true
})

function HomeComponent() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: trees = [] } = useSuspenseQuery(trpc.tree.getAllTrees.queryOptions())

  const handleChatCreated = () => {
    setIsDialogOpen(false)
    queryClient.invalidateQueries({ queryKey: trpc.chat.getAllChats.queryKey({ treeId: 1 }) })
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chat History</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Start New Chat</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Chat</DialogTitle>
            </DialogHeader>
            <NewChatForm
              onChatCreated={handleChatCreated}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trees.map((tree) => (
          <Card key={tree.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="line-clamp-1">{tree.title || `Tree ${tree.id}`}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <Link to="/chat" search={{ treeId: tree.id }}>
                <Button variant="outline" className="w-full">
                  Continue Chat
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <Card className="flex flex-col border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="text-4xl mb-2">+</div>
                <p className="text-lg font-medium">New Chat</p>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Start a new conversation
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Chat</DialogTitle>
            </DialogHeader>
            <NewChatForm
              onChatCreated={handleChatCreated}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
