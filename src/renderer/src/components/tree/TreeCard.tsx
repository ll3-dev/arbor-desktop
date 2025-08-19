import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { Link } from '@tanstack/react-router'

interface TreeCardProps {
  tree: {
    id: number
    title: string
  }
}

export function TreeCard({ tree }: TreeCardProps) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-1">{tree.title || `Tree ${tree.id}`}</CardTitle>
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
