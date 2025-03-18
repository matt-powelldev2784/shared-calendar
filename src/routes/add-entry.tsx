import AddEntry from '@/components/addEntry/addEntry';
import Error from '@/components/ui/error';
import Loading from '@/components/ui/loading';
import getSubscribedCalendars from '@/db/getSubscribedCalendars';
import type { CustomError } from '@/ts/errorClass';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/add-entry')({
  component: AddEntryPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  loader: async () => {
    const calendars = await getSubscribedCalendars();
    return calendars;
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function AddEntryPage() {
  const calendars = useLoaderData({ from: '/add-entry' });

  return (
    <section className="flex h-full w-full flex-col items-center justify-center">
      <AddEntry calendars={calendars} />
    </section>
  );
};