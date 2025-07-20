import type { CalendarEntriesData, Timeslot, TimeslotEntry, TimeslotHeaders } from '@/ts/Calendar';
import { format } from 'date-fns';
import { PendingEntryCard } from '@/components/ui/pendingEntryCard';
import { CalendarCard } from '@/components/ui/calendarCard';

type ReviewPendingEntryProps = {
  calendarEntries: CalendarEntriesData[];
  pendingEntryId: string;
  requestId: string;
  timeslotHeaders: TimeslotHeaders[];
};

const ReviewPendingEntry = ({
  calendarEntries,
  pendingEntryId,
  requestId,
  timeslotHeaders,
}: ReviewPendingEntryProps) => {
  const pendingEntry = calendarEntries
    .flatMap((day) => day.entries)
    .flatMap((timeslot) => timeslot.entries)
    .find((entry) => entry.entryId === pendingEntryId);

  const pendingEntryTimeslot = calendarEntries
    .flatMap((day) => day.entries)
    .find((timeslot) => timeslot.entries.some((entry) => entry.entryId === pendingEntryId));

  return (
    <div className="flex w-full max-w-screen">
      {/* This is the hours displayed on the left side of the calendar view */}
      <section className="mt-2 ml-2 flex h-full w-8 flex-col items-end sm:ml-4">
        <div className="h-11"></div>
        {timeslotHeaders.map((timeslot) => (
          <p
            key={timeslot.hour}
            className="flex h-20 w-8 items-center justify-center border-b-1 border-gray-300 text-xs text-gray-900"
          >
            {timeslot.hour.toString().padStart(2, '0')}
          </p>
        ))}
      </section>

      {/* This is the calendar entries displayed in a grid layout */}
      <section className="auto-row-[minmax(100px,1fr)] m-auto mt-2 mr-2 grid w-full grid-flow-row gap-2 px-4 sm:mr-4 lg:auto-cols-[minmax(100px,1fr)] lg:grid-flow-col">
        {calendarEntries.map((calendarDay, index) => {
          const hourTimeslots = calendarDay.entries;
          const { date } = calendarDay;

          return (
            <div
              key={date.toISOString()}
              className={`flex w-full max-w-full flex-col flex-nowrap lg:flex-col ${
                index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <div className="flex h-11 flex-col justify-center bg-blue-500 p-2 text-center font-bold text-white">
                <p className="h-4.5 text-[14px] lg:text-[13px] xl:text-[14px]">{format(date, 'EEEE')}</p>
                <p className="text-[15px] lg:hidden xl:block">{format(date, 'dd MMMM yyyy')}</p>
                <p className="hidden text-[14px] lg:block xl:hidden">{format(date, 'dd MMM yy')}</p>
              </div>

              {/* This is the calendar entries for each hour */}
              {hourTimeslots.map((hourTimeSlot: Timeslot) => {
                return (
                  <div
                    className="relative h-20 max-w-full overflow-auto border-b-1 border-gray-300"
                    key={`${hourTimeSlot.hour}`}
                  >
                    {/* Render pending entry at top of timeslot */}
                    {pendingEntry && pendingEntryTimeslot?.hour === hourTimeSlot.hour && (
                      <PendingEntryCard
                        entry={pendingEntry}
                        requestId={requestId}
                        key={pendingEntry.entryId}
                        variant="yellow"
                      />
                    )}

                    {/* Render existing entries at bottom of timeslot*/}
                    {hourTimeSlot.entries.map((entry: TimeslotEntry) => {
                      return (
                        entry.entryId !== pendingEntryId && (
                          <CalendarCard key={hourTimeSlot.hour + '-' + entry.id} entry={entry} variant="blue" />
                        )
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default ReviewPendingEntry;
