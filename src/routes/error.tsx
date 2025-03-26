import Error from '@/components/ui/error';
import type { CustomError } from '@/ts/errorClass';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { z } from 'zod';

const errorSearchSchema = z.object({
  status: z.union([z.string(), z.number()]).optional(),
  message: z.string().optional(),
  name: z.string().optional(),
});

export const Route = createFileRoute('/error')({
  component: ErrorPage,

  validateSearch: errorSearchSchema,

  loaderDeps: ({ search }) => ({
    status: search.status,
    message: search.message,
    name: search.name || 'No error name provided',
  }),

  loader: async ({ deps: { status, message, name } }) => {
    return { status, message, name };
  },
});

function ErrorPage() {
  const error = useLoaderData({ from: '/error' });

  return (
    <section className="flex h-full w-full flex-col items-center justify-center">
      <Error error={error as CustomError} />
    </section>
  );
}
