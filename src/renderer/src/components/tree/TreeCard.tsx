import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { Link } from '@tanstack/react-router'
import { UpdateTreeModal } from './UpdateTreeModal'
import { useTreeActions } from '@renderer/hooks/useTreeActions'
import { useToast } from '@renderer/hooks/use-toast'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'

interface TreeCardProps {
  tree: {
    id: number
    title: string
  }
}

export function TreeCard({ tree }: TreeCardProps) {
  const { deleteTree, updateTree } = useTreeActions()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteTree({ treeId: tree.id })
      if (result) {
        toast({
          title: 'Success',
          description: 'Tree deleted successfully'
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete tree',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to delete tree: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async (treeId: number, newTitle: string) => {
    try {
      const result = await updateTree({ treeId, title: newTitle })
      if (result) {
        toast({
          title: 'Success',
          description: 'Tree updated successfully'
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update tree',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to update tree: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      })
    }
  }

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="line-clamp-1">{tree.title || `Tree ${tree.id}`}</CardTitle>
          <div className="flex gap-2 p-4 pt-0">
            <UpdateTreeModal
              tree={tree}
              onUpdate={handleUpdate}
              trigger={
                <Button variant="outline" size="icon">
                  ✏️
                </Button>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  🗑️
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`This action cannot be undone. This will permanently delete the tree "${tree.title}"
                and all associated data.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Link to="/chat" search={{ treeId: tree.id }}>
          <Button variant="outline" className="w-full">
            Continue Chat
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
