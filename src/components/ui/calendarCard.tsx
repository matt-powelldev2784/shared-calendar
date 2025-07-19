import type { CalendarEntry } from '@/ts/Calendar';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ClockIcon } from 'lucide-react';

const variantClasses = {
  default: 'relative cursor-pointer flex',
  blue: 'bg-lightBlue text-grey-900',
  yellow: 'bg-lightYellow text-grey-900',
  white: '',
};

const tabClasses = {
  default: '',
  blue: 'border-lightBlue absolute h-full w-3 border-4 bg-blue-800',
  yellow: 'border-lightYellow absolute h-full w-3 border-4 bg-yellow-800',
  white: '',
};

interface CalendarCardProps {
  entry: CalendarEntry;
  variant: keyof typeof variantClasses;
}

const CalendarCard = ({ entry, variant }: CalendarCardProps) => {
  const navigate = useNavigate();
  const { title, startDate, endDate } = entry;

  // Converts minutes to pixels (1 minute = 1.33px)
  // parent container height is 80px, 60mins === 80px
  // card height is displayed using style tag as tailwind does not support dynamic values
  // minus 1px to stop scroll bar appearing unnecessarily
  const timeslotHeight = Math.max(Math.round(entry.timeslotLength * 1.33)) - 1;
  const cardHeight = `${timeslotHeight}px`;

  const navigateToEntry = () => {
    navigate({
      to: `/view-entry?entryId=${entry.entryId}`,
    });
  };

  return (
    <button
      className={`${variantClasses.default} ${variantClasses[variant]} w-full`}
      onClick={navigateToEntry}
      style={{ height: cardHeight }}
    >
      {/* This is the vertical line on the left side of the card */}
      <div className={`${tabClasses[variant]}`}></div>

      {/* This is the rest of the card */}
      <div className="flex w-full flex-row items-stretch justify-between overflow-hidden">
        <p className="mr-1 flex w-full items-center justify-start truncate overflow-hidden pl-4 text-left text-sm text-ellipsis whitespace-nowrap">
          {title}
        </p>

        <div className="flex w-full min-w-22 flex-row flex-nowrap items-center justify-end gap-0 overflow-hidden">
          <div className="flex h-3 w-3 items-center justify-center">
            <ClockIcon size={10} />
          </div>

          <p className="w-[75px] overflow-clip pr-3 text-[10px]">
            {/* {entryMinutes} */}
            {format(startDate, 'HH:mm')}-{format(endDate, 'HH:mm')}
          </p>
        </div>
      </div>
    </button>
  );
};

export { CalendarCard };
