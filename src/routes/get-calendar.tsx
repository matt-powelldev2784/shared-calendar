import getCalendarEntries from '@/db/getCalendarEntries';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { z } from 'zod';
import { addDays } from 'date-fns';
import Error from '@/components/ui/error';
import sortCalendarEntriesByDate from '@/lib/sortCalendarEntriesByDate';
import { CalendarView } from '@/components/calenderView/calendarView';
import Loading from '@/components/ui/loading';

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

    const calendar = await getCalendarEntries({
      calendarIds: [calendarId],
      startDate: start,
      endDate: end,
    });

    const sortedCalendarEntries = sortCalendarEntriesByDate({
      daysToReturn: daysToView,
      calendarData: calendar,
      firstDateToDisplay: start,
    });

    return sortedCalendarEntries;
  },

  errorComponent: () => {
    return (
      <Error
        error={{
          name: 'Search Params Error',
          status: 404,
          message: 'Error fetching calendar data from search params',
        }}
      />
    );
  },
});

function GetCalendarPage() {
  const calendar = useLoaderData({ from: '/get-calendar' });

  return (
    <div>
      <CalendarView calendarData={calendar} />
    </div>
  );
}

