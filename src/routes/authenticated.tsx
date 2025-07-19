import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { SignIn } from '@/components/auth/signIn';
import { useEffect } from 'react';
import Error from '@/components/ui/error';
import type { CustomError } from '@/ts/errorClass';
import { createInitialUserDocuments } from '@/db/auth/createInitialUserDocuments';
import getSubscribedCalendars from '@/db/calendar/getSubscribedCalendars';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import { getResponsiveStartDate } from '@/lib/getResponsiveStartDate';
import { smallScreenSize } from '@/lib/smallScreenSize';

export const Route = createFileRoute('/authenticated')({
  component: AuthenticatedPage,

  loader: async () => {
    // Create the initial user documents if the user does not exist
    // otherwise get the user
    const user = await createInitialUserDocuments();
    const calendars = await getSubscribedCalendars();
    console.log('calendars', calendars);
    const defaultCalendarId = calendars[0].calendarId;

    return { user, defaultCalendarId };
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function AuthenticatedPage() {
  const navigate = useNavigate();
  const { user, defaultCalendarId } = useLoaderData({ from: '/authenticated' });
  const isSmallScreen = window.innerWidth < smallScreenSize;
  const startDate = getResponsiveStartDate(isSmallScreen, new Date());

  useEffect(() => {
    const calendarUrl = getCalendarUrl({ calendarIds: defaultCalendarId, startDate });
    if (user?.firstTimeUser) {
      setTimeout(() => {
        navigate({ to: calendarUrl });
      }, 1000);
    } else {
      navigate({ to: calendarUrl });
    }
  }, [user]);

  return (
    <section className="flex h-full w-full items-center">
      <SignIn />
    </section>
  );
}
