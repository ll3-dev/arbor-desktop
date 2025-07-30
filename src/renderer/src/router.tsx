import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient } from '@trpc/client'
import { ipcLink } from 'electron-trpc-experimental/renderer'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { routeTree } from './routeTree.gen'
import { ReactNode } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppRouter } from '@shared/type'
import SuperJSON from 'superjson'

export const queryClient = new QueryClient()
export const trpcClient = createTRPCClient({
  links: [ipcLink({ transformer: SuperJSON })]
})
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient
})

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultSsr: false,
    defaultPreload: 'intent',
    context: {
      trpc,
      queryClient
    },
    Wrap: ({ children }: { children: ReactNode }) => {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools />
        </QueryClientProvider>
      )
    }
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
