import getCalendarEntries from '@/db/entry/getCalendarEntriesByDate';
import {
  createFileRoute,
  useLoaderData,
  useSearch,
} from '@tanstack/react-router';
import { z } from 'zod';
import { addDays } from 'date-fns';
import Error from '@/components/ui/error';
import Loading from '@/components/ui/loading';
import type { CustomError } from '@/ts/errorClass';
import getCalendarEntryById from '@/db/entry/getCalendarEntryById';
import getUserDocument from '@/db/auth/getUserDocument';
import ReviewPendingEntry from '@/components/reviewPendingEntry/reviewPendingEntry';
import generateCalendarData from '@/lib/generateCalendarData';

const calendarSearchSchema = z.object({
  entryId: z.string(),
  requestId: z.string(),
});

// example route : domain/review-pending-entry?entryId=abcdefghijklmnopqr
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

    const pendingEntryStartHours = pendingEntry.startDate.getHours();
    const pendingEntryEndHours = pendingEntry.endDate.getHours();

    const calenderData = generateCalendarData({
      daysToReturn: 1,
      calendarData: mergedEntries,
      firstDateToDisplay: pendingEntry.startDate,
      startHour: pendingEntryStartHours > 4 ? pendingEntryStartHours - 4 : 0,
      endHour: pendingEntryEndHours < 19 ? pendingEntryEndHours + 4 : 23,
    });

    return calenderData;
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function ReviewPendingEntryPage() {
  const { entryId, requestId } = useSearch({
    from: '/review-pending-entry',
  });
  const { calendarEntries, timeslotHeaders } = useLoaderData({
    from: '/review-pending-entry',
  });

  const reviewPendingEntryProps = {
    calendarEntries,
    pendingEntry: entryId,
    requestId,
    timeslotHeaders,
  };

  return (
    <section className="flex h-full w-full flex-col items-center">
      <ReviewPendingEntry {...reviewPendingEntryProps} />
    </section>
  );
}
