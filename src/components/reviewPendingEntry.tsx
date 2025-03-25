import type { CalendarEntriesData, CalendarEntry } from '@/ts/Calendar';
import { format } from 'date-fns';
import { PendingEntryCard } from '@/components/ui/pendingEntryCard';
import { CalendarCard } from '@/components/ui/calendarCard';

type ReviewPendingEntryProps = {
  calendarEntries: CalendarEntriesData[];
  pendingEntry: string;
};

const ReviewPendingEntry = ({
  calendarEntries,
  pendingEntry,
}: ReviewPendingEntryProps) => {
  return (
    <div className="mt-2 flex h-full w-full flex-col items-center p-2">
      {calendarEntries.map((calendarEntry, index) => {
        const { entries, date } = calendarEntry;
        return (
          <div
            key={index}
            className="mb-2 flex w-full max-w-[700px] flex-col flex-nowrap gap-1 lg:flex-col"
          >
            <div className="flex h-11 flex-col justify-center bg-zinc-400 p-2 text-center font-bold text-white">
              <p className="h-4.5 text-[14px] lg:text-[13px] xl:text-[14px]">
                {format(date, 'EEEE')}
              </p>
              <p className="text-[15px] lg:hidden xl:block">
                {format(date, 'dd MMMM yyyy')}
              </p>
              <p className="hidden text-[14px] lg:block xl:hidden">
                {format(date, 'dd MMM yy')}
              </p>
            </div>

            {!entries.length && (
              <p className="flex h-14 -translate-y-1 items-center justify-center bg-zinc-100 p-2 text-center text-sm">
                No calendar entries today
              </p>
            )}

            {entries.map((entry: CalendarEntry) => {
              return entry.entryId === pendingEntry ? (
                <PendingEntryCard entry={entry} key={entry.entryId} />
              ) : (
                <CalendarCard
                  key={entry.entryId}
                  entry={entry}
                  variant="purple"
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewPendingEntry;
