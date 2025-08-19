import { useMutation } from '@tanstack/react-query'
import { trpc } from '@renderer/router'

export const useTreeActions = () => {
  // deleteTree 뮤테이션을 사용합니다.
  const { mutateAsync: deleteTree } = useMutation(trpc.tree.deleteTree.mutationOptions())
  // updateTree 뮤테이션을 사용합니다.
  const { mutateAsync: updateTree } = useMutation(trpc.tree.updateTree.mutationOptions())

  return {
    deleteTree,
    updateTree
  }
}
