import { Navbar } from "@/components/navbar/navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <main className="flex w-screen flex-col items-center">
      <Navbar />
      <Outlet />

      {/* <TanStackRouterDevtools /> */}
      {/* <div className="w-full bg-red-500 lg:bg-blue-500 xl:bg-green-500">1</div> */}
    </main>
  ),
});
