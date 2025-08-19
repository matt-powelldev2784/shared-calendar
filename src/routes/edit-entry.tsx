import EditEntry from '@/components/editEntry/editEntry';
import { Navbar } from '@/components/navbar/navbar';
import Error from '@/components/ui/error';
import Loading from '@/components/ui/loading';
import getUserDocument from '@/db/auth/getUserDocument';
import getCalendarEntryById from '@/db/entry/getCalendarEntryById';
import type { CustomError } from '@/ts/errorClass';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { z } from 'zod';

const entrySearchSchema = z.object({
  entryId: z.string(),
});

export const Route = createFileRoute('/edit-entry')({
  component: EditEntryPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  loaderDeps: ({ search }) => ({
    entryId: search.entryId,
  }),

  validateSearch: entrySearchSchema,

  loader: async ({ deps: { entryId } }) => {
    const entry = await getCalendarEntryById(entryId);
    const currentUser = await getUserDocument();
    return { entry, currentUser };
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function EditEntryPage() {
  const editEntryProps = useLoaderData({
    from: '/edit-entry',
  });

  return (
    <main>
      <Navbar />
      <section className="flex h-full w-full flex-col items-center justify-center">
        <EditEntry {...editEntryProps} />
      </section>
    </main>
  );
}
