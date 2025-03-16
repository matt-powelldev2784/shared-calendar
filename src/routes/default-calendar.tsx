import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { format } from 'date-fns';
import Error from '@/components/ui/error';
import Loading from '@/components/ui/loading';
import getSubscribedCalendars from '@/db/getSubscribedCalendars';

export const Route = createFileRoute('/default-calendar')({
  component: DefaultCalendarPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  loader: async () => {
    const calendars = await getSubscribedCalendars();
    const defaultCalendarId = calendars[0].calendarId;

    return defaultCalendarId;
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

function DefaultCalendarPage() {
  const calendarId = useLoaderData({ from: '/default-calendar' });
  const navigate = useNavigate();

  console.log('calendarId', calendarId);

  if (calendarId) {
    navigate({
      to: `/get-calendar?calendarId=${calendarId}&startDate=${format(new Date(), 'yyyy-MM-dd')}&daysToView=7`,
    });
  }
}

export default DefaultCalendarPage;
