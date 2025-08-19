import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AppHeader } from '@renderer/components/common/AppHeader'
import { GlobalNotFound } from '@renderer/components/common/GlobalNotFound'
import { NotFound } from '@renderer/components/common/NotFound'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: GlobalNotFound,
  notFoundComponent: NotFound
})

function RootComponent() {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
