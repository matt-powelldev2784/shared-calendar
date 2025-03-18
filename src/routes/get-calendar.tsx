import getCalendarEntries from '@/db/getCalendarEntries';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { z } from 'zod';
import { addDays } from 'date-fns';
import Error from '@/components/ui/error';
import sortCalendarEntriesByDate from '@/lib/sortCalendarEntriesByDate';
import { CalendarView } from '@/components/calenderView/calendarView';
import Loading from '@/components/ui/loading';
import type { CustomError } from '@/ts/errorClass';

const calendarSearchSchema = z.object({
  calendarId: z.string(),
  startDate: z.string(),
  daysToView: z.number(),
});

// example route : domain/get-calendar?calendarId=yw1klS3kMHGXHFHeqaJ4&startDate=2025-03-15&daysToView=7
export const Route = createFileRoute('/get-calendar')({
  component: GetCalendarPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  validateSearch: calendarSearchSchema,

  loaderDeps: ({ search }) => ({
    calendarId: search.calendarId,
    startDate: search.startDate,
    daysToView: search.daysToView,
  }),

  loader: async ({ deps: { calendarId, startDate, daysToView } }) => {
    const start = startDate ? new Date(startDate) : new Date();
    const end = addDays(new Date(startDate), daysToView);
    const calendarIdArray = calendarId.split(',');

    const calendarEntries = await getCalendarEntries({
      calendarIds: calendarIdArray,
      startDate: start,
      endDate: end,
    });

    const sortedCalendarEntries = sortCalendarEntriesByDate({
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
    <section className="flex h-full w-full items-center">
      <CalendarView calendarEntries={sortedCalendarEntries} />
    </section>
  );
}
