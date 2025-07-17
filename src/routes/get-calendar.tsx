import getCalendarEntries from '@/db/entry/getCalendarEntriesByDate';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { z } from 'zod';
import { addDays } from 'date-fns';
import Error from '@/components/ui/error';
import generateCalendarData from '@/lib/generateCalendarData';
import { CalendarView } from '@/components/calenderView/calendarView';
import Loading from '@/components/ui/loading';
import type { CustomError } from '@/ts/errorClass';

const calendarSearchSchema = z.object({
  calendarIds: z.string(),
  startDate: z.string(),
  daysToView: z.number(),
  startHour: z.number(),
  endHour: z.number(),
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
  }),

  loader: async ({
    deps: { calendarIds, startDate, daysToView, startHour, endHour },
  }) => {
    const start = startDate ? new Date(startDate) : new Date();
    const end = addDays(new Date(startDate), daysToView);
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
    <section className="flex h-full w-full flex-col items-center">
      <CalendarView
        calendarEntries={calendarEntries}
        timeslotHeaders={timeslotHeaders}
      />
    </section>
  );
}
