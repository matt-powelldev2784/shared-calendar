import getCalendarEntries from '@/db/entry/getCalendarEntriesByDate';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { z } from 'zod';
import { addDays, startOfDay } from 'date-fns';
import Error from '@/components/ui/error';
import generateCalendarData from '@/lib/generateCalendarData';
import { CalendarView } from '@/components/calenderView/calendarView';
import Loading from '@/components/ui/loading';
import type { CustomError } from '@/ts/errorClass';
import { Navbar } from '@/components/navbar/navbar';

const calendarSearchSchema = z.object({
  calendarIds: z.string(),
  startDate: z.string(),
  daysToView: z.number(),
  startHour: z.number(),
  endHour: z.number(),
  selectedDate: z.string(),
  uniqueRefreshString: z.number(),
});

// example route : domain/get-calendar?calendarId=abcdefghijklmnopqrstuvwxyz&startDate=2025-03-15&daysToView=7
export const Route = createFileRoute('/get-calendar')({
  component: GetCalendarPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  validateSearch: calendarSearchSchema,

  loaderDeps: ({ search }) => ({
    calendarIds: search.calendarIds,
    startDate: search.startDate,
    daysToView: search.daysToView,
    startHour: search.startHour,
    endHour: search.endHour,
    selectedDate: search.selectedDate,
    uniqueRefreshString: search.uniqueRefreshString,
  }),

  loader: async ({ deps: { calendarIds, startDate, daysToView, startHour, endHour } }) => {
    const start = startDate ? startOfDay(startDate) : startOfDay(new Date());
    const end = startOfDay(addDays(new Date(startDate), daysToView));
    const calendarIdArray = calendarIds.split(',');

    const calendarEntries = await getCalendarEntries({
      calendarIds: calendarIdArray,
      startDate: start,
      endDate: end,
    });

    const calendarData = generateCalendarData({
      daysToReturn: daysToView,
      calendarData: calendarEntries,
      firstDateToDisplay: start,
      startHour,
      endHour,
    });

    return calendarData;
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function GetCalendarPage() {
  const { calendarEntries, timeslotHeaders } = useLoaderData({
    from: '/get-calendar',
  });

  return (
    <main>
      <Navbar />
      <section className="flex h-full w-full flex-col items-center justify-center">
        <CalendarView calendarEntries={calendarEntries} timeslotHeaders={timeslotHeaders} />
      </section>
    </main>
  );
}
