import getCalendarEntries from '@/db/getCalendarEntries';
import {
  createFileRoute,
  useLoaderData,
  useSearch,
} from '@tanstack/react-router';
import { z } from 'zod';
import { addDays } from 'date-fns';
import Error from '@/components/ui/error';
import sortCalendarEntriesByDate from '@/lib/sortCalendarEntriesByDate';
import Loading from '@/components/ui/loading';
import type { CustomError } from '@/ts/errorClass';
import getCalendarEntryById from '@/db/getCalendarEntryById';
import getUserDocument from '@/db/getUserDocument';
import ReviewPendingEntry from '@/components/reviewPendingEntry';

const calendarSearchSchema = z.object({
  entryId: z.string(),
  requestId: z.string(),
});

// example route : domain/review-pending-entry?entryId=I7IqzEMLKWh4Jdxuddzp
export const Route = createFileRoute('/review-pending-entry')({
  component: ReviewPendingEntryPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  validateSearch: calendarSearchSchema,

  loaderDeps: ({ search }) => ({
    entryId: search.entryId,
    requestId: search.requestId,
  }),

  loader: async ({ deps: { entryId } }) => {
    const pendingEntry = await getCalendarEntryById(entryId);
    const userDocument = await getUserDocument();

    const startDateAtMidnight = new Date(pendingEntry.startDate);
    startDateAtMidnight.setHours(0, 0, 0, 0);

    const calendarEntries = await getCalendarEntries({
      calendarIds: [userDocument.defaultCalendarId],
      startDate: startDateAtMidnight,
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

function ReviewPendingEntryPage() {
  const { entryId, requestId } = useSearch({ from: '/review-pending-entry' });
  const sortedCalendarEntries = useLoaderData({
    from: '/review-pending-entry',
  });

  return (
    <section className="flex h-full w-full flex-col items-center">
      <ReviewPendingEntry
        calendarEntries={sortedCalendarEntries}
        pendingEntry={entryId}
        requestId={requestId}
      />
    </section>
  );
}
