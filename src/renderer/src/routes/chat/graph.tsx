import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/graph')({
  component: GraphRouteComponent
})

function GraphRouteComponent() {
  return (
    <div>
      <h1>Chat Graph View</h1>
      <p>This page will display a graph visualization of chat conversations.</p>
    </div>
  )
}
