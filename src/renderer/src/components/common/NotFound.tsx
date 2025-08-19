export function NotFound() {
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
