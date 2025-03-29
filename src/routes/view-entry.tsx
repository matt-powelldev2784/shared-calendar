import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import Error from '@/components/ui/error';
import Loading from '@/components/ui/loading';
import type { CustomError } from '@/ts/errorClass';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import getCalendarEntryById from '@/db/entry/getCalendarEntryById';
import { z } from 'zod';

const entrySearchSchema = z.object({
  entryId: z.string(),
});

export const Route = createFileRoute('/view-entry')({
  component: ViewEntryPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  loaderDeps: ({ search }) => ({
    entryId: search.entryId,
  }),

  validateSearch: entrySearchSchema,

  loader: async ({ deps: { entryId } }) => {
    const entry = await getCalendarEntryById(entryId);
    return entry;
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function ViewEntryPage() {
  const entry = useLoaderData({ from: '/view-entry' });
  const navigate = useNavigate();

  return (
    <section className="flex h-full w-full items-center">
      <div className="flex w-full flex-col items-center">
        <h1 className="text-2xl font-bold">{entry.title}</h1>
        <p className="text-lg">{entry.description}</p>
        <p className="text-lg">
          {entry.startDate.toLocaleString()} - {entry.endDate.toLocaleString()}
        </p>
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => {
            const calendarUrl = getCalendarUrl({
              calendarIds: entry.calendarId,
            });
            navigate({ to: calendarUrl });
          }}
        >
          Go to Calendar
        </button>
        <button
          className="mt-4 rounded bg-green-500 px-4 py-2 text-white"
          onClick={() => {
            const calendarUrl = getCalendarUrl({
              calendarIds: entry.calendarId,
            });
            navigate({ to: calendarUrl });
          }}
        >
          Edit Entry
        </button>
      </div>
    </section>
  );
}
