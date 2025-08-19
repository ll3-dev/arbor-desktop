import { Link } from '@tanstack/react-router'

export function AppHeader() {
  return (
    <header className="border-b">
      <nav className="container flex items-center justify-between py-4 mx-auto">
        <Link to="/" className="text-xl font-bold">
          Arbor Chat
        </Link>
        <div className="flex gap-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/chat/graph" className="hover:underline">
            Graph View
          </Link>
        </div>
      </nav>
    </header>
  )
}
