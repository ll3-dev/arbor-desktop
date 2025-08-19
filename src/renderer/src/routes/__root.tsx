import { ErrorComponentProps, Link, Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: GlobalNotFound,
  notFoundComponent: NotFound
})

function RootComponent() {
  return (
    <div className="flex flex-col h-screen">
      <header className="border-b">
        <nav className="container flex items-center justify-between py-4 max-w-[1200px] mx-auto">
          <Link to="/" className="text-xl font-bold">
            Arbor Chat
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/chat" className="hover:underline">
              Chat
            </Link>
            <Link to="/chat/graph" className="hover:underline">
              Graph View
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

function GlobalNotFound({ error, info }: ErrorComponentProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-3xl font-bold">404 - Not Found</h1>
      <p className="text-red-500 mt-2">{error.message}</p>
      <pre className="text-gray-500 mt-2">{info?.componentStack}</pre>
    </div>
  )
}

function NotFound() {
  const url = new URL(window.location.href)

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      <h1 className="text-3xl font-bold">404 - Not Found</h1>
      <p className="text-red-500 mt-2">
        The requested URL <code>{url.pathname}</code> was not found
      </p>
    </div>
  )
}
