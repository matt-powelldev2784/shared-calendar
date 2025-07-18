import type { CalendarEntry } from '@/ts/Calendar';
import { useNavigate } from '@tanstack/react-router';
import { differenceInMinutes, format } from 'date-fns';
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
  const entryTimeMinutes = differenceInMinutes(endDate, startDate);
  const cardHeight = Math.max(entryTimeMinutes / 3, 5).toFixed(0); // 5 is the min height for an entry card
  console.log('cardHeight', cardHeight);

  const navigateToEntry = () => {
    navigate({
      to: `/view-entry?entryId=${entry.entryId}`,
    });
  };

  return (
    <button
      className={`${variantClasses.default} ${variantClasses[variant]} w-full h-${cardHeight} min-h-${cardHeight}`}
      onClick={navigateToEntry}
    >
      {/* This is the vertical line on the left side of the card */}
      <div className={`${tabClasses[variant]}`}></div>

      {/* This is the rest of the card */}
      <div className="flex w-full flex-row items-stretch justify-between overflow-hidden">
        <p className="mr-1 flex w-full items-center justify-start truncate overflow-hidden pl-4 text-left text-sm text-ellipsis whitespace-nowrap">
          {title}
        </p>

        <div className="flex w-full min-w-20 flex-row flex-nowrap items-center justify-end gap-0 overflow-hidden">
          <ClockIcon size={10} className="w-4" />
          <p className="overflow-clip pr-3 text-[10px]">
            {/* {entryMinutes} */}
            {format(startDate, 'HH:mm')}-{format(endDate, 'HH:mm')}
          </p>
        </div>
      </div>
    </button>
  );
};

export { CalendarCard };
