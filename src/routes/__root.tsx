import { Navbar } from '@/components/navbar/navbar';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Outlet />

      {/* <TanStackRouterDevtools /> */}
    </QueryClientProvider>
  ),
});
