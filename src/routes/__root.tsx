import { Navbar } from "@/components/navbar/navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Outlet />

      {/* <TanStackRouterDevtools /> */}
      <div className="w-full bg-red-500 text-center sm:hidden">default red</div>
      <div className="hidden w-full text-center sm:block sm:bg-blue-500 md:hidden">
        small blue
      </div>
      <div className="hidden w-full text-center sm:hidden md:block md:bg-green-500 lg:hidden xl:hidden">
        md green
      </div>
      <div className="hidden w-full bg-orange-500 text-center lg:block xl:hidden">
        lg orange
      </div>
      <div className="hidden w-full bg-pink-500 text-center sm:hidden md:hidden lg:hidden xl:block">
        xl pink
      </div>
    </QueryClientProvider>
  ),
});
