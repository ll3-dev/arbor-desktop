import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { useState } from 'react'

interface UpdateTreeModalProps {
  tree: {
    id: number
    title: string
  }
  onUpdate: (treeId: number, newTitle: string) => void
  trigger: React.ReactNode
}

export function UpdateTreeModal({ tree, onUpdate, trigger }: UpdateTreeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(tree.title)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(tree.id, title)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Tree</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-4"
                placeholder="Enter tree title"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
