import { deleteTree, updateTree } from '@main/database/tree'

export const deleteTreeAction = async (treeId: number) => {
  try {
    const result = await deleteTree(treeId)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error deleting tree:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const updateTreeAction = async (treeId: number, title: string) => {
  try {
    const result = await updateTree(treeId, title)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error updating tree:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
