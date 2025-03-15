import getCalendarEntries from '@/db/getCalendarEntries';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { addDays } from 'date-fns';
import Error from '@/components/ui/error';
import sortCalendarEntriesByDate from '@/lib/sortCalendarEntriesByDate';
import { CalendarView } from '@/components/calenderView/calendarView';
import Loading from '@/components/ui/loading';
import getSubscribedCalendars from '@/db/getSubscribedCalendars';

export const Route = createFileRoute('/default-calendar')({
  component: GetCalendarPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  loader: async () => {
    const calendars = await getSubscribedCalendars();
    const defaultCalendarId = calendars[0].calendarId;

    const start = new Date();
    const end = addDays(new Date(start), 7);

    const calendar = await getCalendarEntries({
      calendarIds: [defaultCalendarId],
      startDate: start,
      endDate: end,
    });

    const sortedCalendarEntries = sortCalendarEntriesByDate({
      daysToReturn: 7,
      calendarData: calendar,
      firstDateToDisplay: start,
    });

    return sortedCalendarEntries;
  },

  errorComponent: () => {
    return (
      <Error
        error={{
          name: 'Get default calendar error',
          status: 404,
          message: 'Error fetching default calendar data',
        }}
      />
    );
  },
});

function GetCalendarPage() {
  const calendar = useLoaderData({ from: '/default-calendar' });

  return (
    <div>
      <CalendarView calendarData={calendar} />
    </div>
  );
}

export default GetCalendarPage;
