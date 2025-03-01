import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <main className="flex w-screen flex-col items-center">
      <div className="bg-primary flex w-full items-center justify-center py-2 text-xl font-bold text-white">
        Sharc
      </div>

      <Outlet />

      {/* <TanStackRouterDevtools /> */}
      {/* <div className="w-full bg-red-500 lg:bg-blue-500 xl:bg-green-500">1</div> */}
    </main>
  ),
});
