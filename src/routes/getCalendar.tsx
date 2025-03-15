import getCalendarEntries from '@/db/getCalendarEntries';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { addDays } from 'date-fns';
import Error from '@/components/ui/error';

const calendarSearchSchema = z.object({
  calendarId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const Route = createFileRoute('/getCalendar')({
  component: GetCalendarPage,

  validateSearch: calendarSearchSchema,

  loaderDeps: ({ search }) => ({ search }),

  beforeLoad: async ({ search }) => {
    const { calendarId, startDate, endDate } = search;
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : addDays(new Date(), 6);

    const calendar = await getCalendarEntries({
      calendarIds: [calendarId],
      startDate: start,
      endDate: end,
    });

    return { calendar };
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
  const { calendarId, startDate, endDate } = Route.useSearch();

  console.log('search params', { calendarId, startDate, endDate });

  return (
    <div>
      <h1>Calendar Details</h1>
      {/* Render calendar details */}
    </div>
  );
}

export default GetCalendarPage;
