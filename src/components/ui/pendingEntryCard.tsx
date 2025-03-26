import { Button } from '@/components/ui/button';
import { CalendarCard } from '@/components/ui/calendarCard';
import acceptPendingEntry from '@/db/acceptPendingEntry';
import rejectPendingEntry from '@/db/rejectPendingEntry';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import type { CalendarEntry } from '@/ts/Calendar';
import type { CustomError } from '@/ts/errorClass';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';

type PendingEntryCardProps = {
  entry: CalendarEntry;
  requestId: string;
};

const PendingEntryCard = ({ entry, requestId }: PendingEntryCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: async () => {
      await acceptPendingEntry({ entryId: entry.entryId, requestId });
    },
    onSuccess: () => {
      const calendarUrl = getCalendarUrl({
        calendarIds: entry.calendarId,
        startDate: format(entry.startDate, 'yyyy-MM-dd'),
      });

      queryClient.invalidateQueries({ queryKey: ['requests'] });
      navigate({ to: calendarUrl });
    },
    onError: (error: CustomError) => {
      const status = error?.status || 500;
      const message = 'Error accepting pending entry';
      navigate({ to: `/error?status=${status}&message=${message}` });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      await rejectPendingEntry({ requestId });
    },
    onSuccess: () => {
      const calendarUrl = getCalendarUrl({
        calendarIds: entry.calendarId,
      });

      queryClient.invalidateQueries({ queryKey: ['requests'] });
      navigate({ to: calendarUrl });
    },
    onError: (error: CustomError) => {
      const status = error?.status || 500;
      const message = 'Error rejecting pending entry';
      navigate({ to: `/error?status=${status}&message=${message}` });
    },
  });

  return (
    <article className="border-primary/75 flex w-full flex-col gap-2 rounded-xl border-3 border-dashed p-2">
      <CalendarCard entry={entry} variant="white" />
      <div className="flex gap-2 p-2">
        <Button
          variant="destructive"
          size="default"
          className="w-full"
          onClick={() => rejectMutation.mutate()}
        >
          Reject
        </Button>

        <Button
          size="default"
          className="w-full"
          onClick={() => {
            acceptMutation.mutate();
          }}
        >
          Accept
        </Button>
      </div>
    </article>
  );
};

export { PendingEntryCard };
