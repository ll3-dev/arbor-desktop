import { ErrorComponentProps } from '@tanstack/react-router'

export function GlobalNotFound({ error, info }: ErrorComponentProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-3xl font-bold">404 - Not Found</h1>
      <p className="text-red-500 mt-2">{error.message}</p>
      <pre className="text-gray-500 mt-2">{info?.componentStack}</pre>
    </div>
  )
}
