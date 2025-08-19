import { useState } from 'react'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { NewChatForm } from '@renderer/components/common/NewChatForm'
import { TreeCard } from '@renderer/components/tree/TreeCard'
import { NewChatCard } from '@renderer/components/tree/NewChatCard'
import { useQueryClient } from '@tanstack/react-query'
import { trpc } from '@renderer/router'

interface ChatHistoryViewProps {
  trees: Array<{
    id: number
    title: string
  }>
}

export function ChatHistoryView({ trees }: ChatHistoryViewProps) {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleChatCreated = (treeId: number) => {
    setIsDialogOpen(false)
    queryClient.invalidateQueries({ queryKey: trpc.chat.getAllChats.queryKey({ treeId }) })
  }

  return (
    <div className="container py-8 mx-auto">
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
        <NewChatCard onChatCreated={handleChatCreated} />
        {trees.map((tree) => (
          <TreeCard key={tree.id} tree={tree} />
        ))}
      </div>
    </div>
  )
}
