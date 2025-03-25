import getCalendarEntries from '@/db/getCalendarEntries';
import {
  createFileRoute,
  useLoaderData,
  useSearch,
} from '@tanstack/react-router';
import { z } from 'zod';
import { addDays, format } from 'date-fns';
import Error from '@/components/ui/error';
import sortCalendarEntriesByDate from '@/lib/sortCalendarEntriesByDate';
import Loading from '@/components/ui/loading';
import type { CustomError } from '@/ts/errorClass';
import getCalendarEntryById from '@/db/getCalendarEntryById';
import { CalendarCard } from '@/components/ui/calendarCard';
import type { CalendarEntry } from '@/ts/Calendar';
import getUserDocument from '@/db/getUserDocument';
import { PendingEntryCard } from '@/components/ui/pendingEnrtyCard';

const calendarSearchSchema = z.object({
  entryId: z.string(),
});

// example route : domain/subscribe-to-entry?entryId=gyzjb4QKR2DyW2hFp7I1
export const Route = createFileRoute('/subscribe-to-entry')({
  component: SubscribeToEntryPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  validateSearch: calendarSearchSchema,

  loaderDeps: ({ search }) => ({
    entryId: search.entryId,
  }),

  loader: async ({ deps: { entryId } }) => {
    const pendingEntry = await getCalendarEntryById(entryId);
    const userDocument = await getUserDocument();

    const calendarEntries = await getCalendarEntries({
      calendarIds: [userDocument.defaultCalendarId],
      startDate: pendingEntry.startDate,
      endDate: addDays(pendingEntry.endDate, 1),
    });
    const mergedEntries = [...calendarEntries, pendingEntry];

    const sortedCalendarEntries = sortCalendarEntriesByDate({
      daysToReturn: 1,
      calendarData: mergedEntries,
      firstDateToDisplay: pendingEntry.startDate,
    });

    return sortedCalendarEntries;
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function SubscribeToEntryPage() {
  const { entryId } = useSearch({ from: '/subscribe-to-entry' });
  const sortedCalendarEntries = useLoaderData({
    from: '/subscribe-to-entry',
  });

  return (
    <section className="mt-2 flex h-full w-full flex-col items-center p-2">
      {sortedCalendarEntries.map((calendarEntry, index) => {
        const { entries, date } = calendarEntry;
        return (
          <div
            key={index}
            className="mb-2 flex w-full max-w-[700px] flex-col flex-nowrap gap-1 lg:flex-col"
          >
            <div className="flex h-11 flex-col justify-center bg-zinc-400 p-2 text-center font-bold text-white">
              <p className="h-4.5 text-[14px] lg:text-[13px] xl:text-[14px]">
                {format(date, 'EEEE')}
              </p>
              <p className="text-[15px] lg:hidden xl:block">
                {format(date, 'dd MMMM yyyy')}
              </p>
              <p className="hidden text-[14px] lg:block xl:hidden">
                {format(date, 'dd MMM yy')}
              </p>
            </div>

            {!entries.length && (
              <p className="flex h-14 -translate-y-1 items-center justify-center bg-zinc-100 p-2 text-center text-sm">
                No calendar entries today
              </p>
            )}

            {entries.map((entry: CalendarEntry) => {
              return entry.entryId === entryId ? (
                <PendingEntryCard entry={entry} key={entry.entryId} />
              ) : (
                <CalendarCard
                  key={entry.entryId}
                  entry={entry}
                  variant="purple"
                />
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
