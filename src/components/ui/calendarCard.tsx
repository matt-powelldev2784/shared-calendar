import type { TimeslotEntry } from '@/ts/Calendar';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ClockIcon } from 'lucide-react';

const variantClasses = {
  default: 'relative cursor-pointer flex',
  blue: 'bg-primary/10 text-grey-900',
  yellow: 'bg-lightYellow text-grey-900',
  white: '',
};

const tabClasses = {
  default: '',
  blue: 'absolute h-full w-1.5 bg-primary',
  yellow: 'border-lightYellow absolute h-full w-3 border-4 bg-yellow-800',
  white: '',
};

interface CalendarCardProps {
  entry: TimeslotEntry;
  variant: keyof typeof variantClasses;
}

const CalendarCard = ({ entry, variant }: CalendarCardProps) => {
  const navigate = useNavigate();
  const { title, startDate, endDate } = entry;

  // Converts minutes to pixels (1 minute = 1.33px)
  // parent container height is 80px, 60mins === 80px
  // each height has minus 1px from final value
  // this is to stop the scroll bar appearing when the card is exactly the size of the parent
  // card height is rendered using the style tag as tailwind does not support dynamic values
  const timeslotHeight = Math.max(Math.round(entry.timeslotLength * 1.33), 19) - 1;
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
      {/* Vertical line on the left side of the card */}
      <div className={`${tabClasses[variant]}`}></div>

      <div className="flex w-full flex-row items-stretch justify-between overflow-hidden">
        <p className="mr-1 flex w-full items-center justify-start truncate overflow-hidden pl-4 text-left text-sm text-ellipsis whitespace-nowrap">
          {title}
        </p>

        <div className="flex w-full min-w-22 flex-row flex-nowrap items-center justify-end gap-0 overflow-hidden">
          <div className="flex h-3 w-3 items-center justify-center">
            <ClockIcon size={10} />
          </div>

          <p className="w-[75px] overflow-clip pr-3 text-[10px]">
            {format(startDate, 'HH:mm')}-{format(endDate, 'HH:mm')}
          </p>
        </div>
      </div>
    </button>
  );
};

export { CalendarCard };
