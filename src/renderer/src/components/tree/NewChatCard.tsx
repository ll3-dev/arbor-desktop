import { Card, CardContent } from '@renderer/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { NewChatForm } from '@renderer/components/common/NewChatForm'

interface NewChatCardProps {
  onChatCreated?: (treeId: number) => void
}

export function NewChatCard({ onChatCreated }: NewChatCardProps) {
  return (
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
          onChatCreated={onChatCreated}
          onCancel={() => {}} // onCancel은 DialogTrigger가 닫히도록 하므로 여기서는 빈 함수로 둡니다.
        />
      </DialogContent>
    </Dialog>
  )
}
