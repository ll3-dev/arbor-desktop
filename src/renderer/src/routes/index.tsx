import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { trpc } from '@renderer/router'
import { ChatHistoryView } from '@renderer/components/tree/ChatHistoryView'

export const Route = createFileRoute('/')({
  component: HomeComponent,
  wrapInSuspense: true
})

function HomeComponent() {
  const { data: trees = [] } = useSuspenseQuery(trpc.tree.getAllTrees.queryOptions())

  return <ChatHistoryView trees={trees} />
}
