import { Button } from '@/components/ui/button';
import { CalendarCard } from '@/components/ui/calendarCard';
import acceptPendingEntry from '@/db/acceptPendingEntry';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import type { CalendarEntry } from '@/ts/Calendar';
import type { CustomError } from '@/ts/errorClass';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';

type PendingEntryCardProps = {
  entry: CalendarEntry;
  requestId: string;
};

const PendingEntryCard = ({ entry, requestId }: PendingEntryCardProps) => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      await acceptPendingEntry({ entryId: entry.entryId, requestId });
    },
    onSuccess: () => {
      const calendarUrl = getCalendarUrl({
        calendarIds: entry.calendarId,
        startDate: format(entry.startDate, 'yyyy-MM-dd'),
      });

      navigate({ to: calendarUrl });
    },
    onError: (error: CustomError) => {
      const status = error?.status || 500;
      const message = 'Error accepting pending entry';
      navigate({ to: `/error?status=${status}&message=${message}` });
    },
  });

  return (
    <article className="border-primary/75 flex w-full flex-col gap-2 rounded-xl border-3 border-dashed p-2">
      <CalendarCard entry={entry} variant="white" />
      <div className="flex gap-2 p-2">
        <Button variant="destructive" size="default" className="w-full">
          Reject
        </Button>
        <Button
          size="default"
          className="w-full"
          onClick={() => {
            mutation.mutate();
          }}
        >
          Accept
        </Button>
      </div>
    </article>
  );
};

export { PendingEntryCard };
