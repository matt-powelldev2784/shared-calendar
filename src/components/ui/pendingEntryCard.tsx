import { Button } from '@/components/ui/button';
import acceptPendingEntry from '@/db/request/acceptPendingEntry';
import rejectPendingEntry from '@/db/request/rejectPendingEntry';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import type { CalendarEntry } from '@/ts/Calendar';
import type { CustomError } from '@/ts/errorClass';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ClockIcon } from 'lucide-react';

const variantClasses = {
  default: 'relative flex cursor-pointer border-dotted border-2 border-orange-500',
  blue: 'bg-lightBlue text-grey-900',
  yellow: 'bg-lightYellow text-darkYellow',
  white: '',
};

const tabClasses = {
  default: '',
  blue: 'border-lightBlue absolute h-full w-3 border-4 bg-blue-800',
  yellow: 'border-lightYellow absolute h-full w-3 border-4 bg-yellow-800',
  white: '',
};

type PendingEntryCardProps = {
  entry: CalendarEntry;
  requestId: string;
  numberOfEntries: number;
  variant: keyof typeof variantClasses;
};

const PendingEntryCard = ({ entry, requestId, variant }: PendingEntryCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { title, startDate, endDate } = entry;

  const navigateToEntry = () => {
    navigate({
      to: `/view-entry?entryId=${entry.entryId}`,
    });
  };

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
      navigate({ to: calendarUrl, replace: true });
    },
    onError: (error: CustomError) => {
      const status = error?.status || 500;
      const message = 'Error accepting pending entry';
      navigate({ to: `/error?status=${status}&message=${message}` });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      await rejectPendingEntry({ entryId: entry.entryId, requestId });
    },
    onSuccess: () => {
      const calendarUrl = getCalendarUrl({
        calendarIds: entry.calendarId,
      });

      queryClient.invalidateQueries({ queryKey: ['requests'] });
      navigate({ to: calendarUrl, replace: true });
    },
    onError: (error: CustomError) => {
      const status = error?.status || 500;
      const message = 'Error rejecting pending entry';
      navigate({ to: `/error?status=${status}&message=${message}` });
    },
  });

  return (
    <article
      className={`${variantClasses.default} ${variantClasses[variant]} w-full max-w-full overflow-hidden`}
      onClick={navigateToEntry}
    >
      {/* This is the vertical line on the left side of the card */}
      <div className={`${tabClasses[variant]}`}></div>

      {/* This is the rest of the card */}
      <div className="flex w-full flex-col items-start justify-center overflow-hidden pl-3 sm:flex-row sm:items-center sm:justify-start sm:gap-3">
        <p className="max-h-[22px] w-full max-w-[150px] flex-1 truncate overflow-hidden leading-4 sm:max-w-full">
          {title}
        </p>

        <div className="overflow-hidden0 flex w-full max-w-32 flex-row flex-nowrap items-center justify-start gap-0 sm:gap-1">
          <ClockIcon size={13} className="w-4" />
          <p className="mr-2 text-xs sm:text-sm">
            {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
          </p>
        </div>
      </div>

      {/* Accept and reject buttons */}
      <div className="flex w-full max-w-22 flex-col flex-nowrap items-center justify-center sm:max-w-44 sm:flex-row sm:gap-2 sm:p-2">
        <Button
          size="default"
          className={`h-[25px] w-[75px] bg-green-500 hover:bg-green-500`}
          onClick={() => {
            acceptMutation.mutate();
          }}
        >
          Accept
        </Button>

        <Button
          variant="destructive"
          size="default"
          className={`h-[25px] w-[75px]`}
          onClick={() => rejectMutation.mutate()}
        >
          Reject
        </Button>
      </div>
    </article>
  );
};

export { PendingEntryCard };
