import getCalendarEntries from '@/db/entry/getCalendarEntriesByDate';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { z } from 'zod';
import { addDays } from 'date-fns';
import Error from '@/components/ui/error';
import sortCalendarEntriesByDateTime from '@/lib/sortCalendarEntriesByDateTime';
import { CalendarView } from '@/components/calenderView/calendarView';
import Loading from '@/components/ui/loading';
import type { CustomError } from '@/ts/errorClass';

const calendarSearchSchema = z.object({
  calendarIds: z.string(),
  startDate: z.string(),
  daysToView: z.number(),
});

// example route : domain/get-calendar?calendarId=yw1klS3kMHGXHFHeqaJ4&startDate=2025-03-15&daysToView=7
export const Route = createFileRoute('/get-calendar')({
  component: GetCalendarPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  validateSearch: calendarSearchSchema,

  loaderDeps: ({ search }) => ({
    calendarIds: search.calendarIds,
    startDate: search.startDate,
    daysToView: search.daysToView,
  }),

  loader: async ({ deps: { calendarIds, startDate, daysToView } }) => {
    const start = startDate ? new Date(startDate) : new Date();
    const end = addDays(new Date(startDate), daysToView);
    const calendarIdArray = calendarIds.split(',');

    const calendarEntries = await getCalendarEntries({
      calendarIds: calendarIdArray,
      startDate: start,
      endDate: end,
    });

    const sortedCalendarEntries = sortCalendarEntriesByDateTime({
      daysToReturn: daysToView,
      calendarData: calendarEntries,
      firstDateToDisplay: start,
    });

    return sortedCalendarEntries;
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function GetCalendarPage() {
  const sortedCalendarEntries = useLoaderData({
    from: '/get-calendar',
  });

  return (
    <section className="flex h-full w-full flex-col items-center">
      <CalendarView calendarEntries={sortedCalendarEntries} />
    </section>
  );
}
