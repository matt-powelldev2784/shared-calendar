import type { CalendarEntry } from '@/ts/Calendar';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ClockIcon } from 'lucide-react';

const variantClasses = {
  default: 'w-full flex flex-row gap-1 h-14 items-center cursor-pointer',
  pink: 'bg-lightPink text-darkPink',
  green: 'bg-lightGreen  text-darkGreen',
  purple: 'bg-lightPurple text-darkPurple',
  blue: 'bg-lightBlue text-darkBlue',
  yellow: 'bg-lightYellow text-darkYellow',
  white: '',
};

const dateIconClasses = {
  default:
    'text-xs text-white w-10 h-10 min-w-10 min-h-10 flex-col items-center justify-center rounded-full ml-2.5 flex flex lg:hidden',
  pink: 'bg-darkPink',
  green: 'bg-darkGreen',
  purple: 'bg-darkPurple',
  blue: 'bg-darkBlue',
  yellow: 'bg-darkYellow',
  white: 'bg-secondary',
};

interface CalendarCardProps {
  entry: CalendarEntry;
  variant: keyof typeof variantClasses;
}

const CalendarCard = ({ entry, variant }: CalendarCardProps) => {
  const navigate = useNavigate();
  const { title, startDate, endDate } = entry;
  const navigateToEntry = () => {
    navigate({
      to: `/view-entry?entryId=${entry.entryId}`,
    });
  };

  return (
    <button
      className={`${variantClasses.default} ${variantClasses[variant]} w-full`}
      onClick={navigateToEntry}
    >
      <p className={`${dateIconClasses.default} ${dateIconClasses[variant]}`}>
        {format(startDate, 'HH:mm')}
      </p>

      <div className="flex w-full -translate-y-0.75 flex-col items-start justify-center gap-1.5 overflow-hidden p-2 lg:gap-2">
        <p className="text-md h-6 w-full translate-y-1 truncate overflow-hidden text-left text-ellipsis whitespace-nowrap">
          {title}
        </p>

        <p className="flex flex-row items-center gap-1 text-[11px] lg:gap-2">
          <ClockIcon size={13} />
          {format(startDate, 'HH:mm')}-{format(endDate, 'HH:mm')}
        </p>
      </div>
    </button>
  );
};

export { CalendarCard };
