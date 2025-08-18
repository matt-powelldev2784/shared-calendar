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
import { format } from 'date-fns';
import { Navbar } from '@/components/navbar/navbar';

export const Route = createFileRoute('/authenticated')({
  component: AuthenticatedPage,

  loader: async () => {
    // Create the initial user documents if the user does not exist
    // otherwise get the user
    const user = await createInitialUserDocuments();
    const calendars = await getSubscribedCalendars();
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

  useEffect(() => {
    const calendarUrl = getCalendarUrl({
      calendarIds: defaultCalendarId,
      selectedDate: format(new Date(), 'yyyy-MM-dd'),
    });
    if (user?.firstTimeUser) {
      setTimeout(() => {
        navigate({ to: calendarUrl });
      }, 1000);
    } else {
      navigate({ to: calendarUrl });
    }
  }, [user]);

  return (
    <main>
      <Navbar />
      <section className="flex h-full w-full flex-col items-center justify-center">
        <SignIn />
      </section>
    </main>
  );
}
