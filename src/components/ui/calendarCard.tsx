import type { CalendarEntry } from '@/ts/Calendar';
import { useNavigate } from '@tanstack/react-router';
import { differenceInMinutes } from 'date-fns';
import { ClockIcon } from 'lucide-react';

const variantClasses = {
  default: 'relative cursor-pointer flex',
  pink: 'bg-lightPink text-darkPink',
  green: 'bg-lightGreen  text-darkGreen',
  purple: 'bg-lightPurple text-darkPurple',
  blue: 'bg-lightBlue text-grey-900',
  yellow: 'bg-lightYellow text-darkYellow',
  white: '',
};

interface CalendarCardProps {
  entry: CalendarEntry;
  variant: keyof typeof variantClasses;
  numberOfEntries: number;
}

const CalendarCard = ({
  entry,
  variant,
  numberOfEntries,
}: CalendarCardProps) => {
  const navigate = useNavigate();
  const { title, startDate, endDate } = entry;
  const numberOfEntriesRounded =
    numberOfEntries % 2 === 0 ? numberOfEntries : numberOfEntries + 1;
  const entryMinutes = differenceInMinutes(endDate, startDate);
  const cardHeight =
    numberOfEntries === 1 ? 20 : Math.floor(20 / numberOfEntriesRounded);

  const navigateToEntry = () => {
    navigate({
      to: `/view-entry?entryId=${entry.entryId}`,
    });
  };

  return (
    <button
      className={`${variantClasses.default} ${variantClasses[variant]} w-full h-${cardHeight} max-h-${cardHeight}`}
      onClick={navigateToEntry}
    >
      {/* This is the vertical line on the left side of the card */}
      <div className="border-lightBlue absolute h-full w-3 border-4 bg-blue-800"></div>

      {/* This is the rest of the card */}
      <div className="flex w-full flex-row items-stretch justify-between overflow-hidden">
        <p className="mr-1 flex w-full items-center justify-start truncate overflow-hidden pl-4 text-left text-sm text-ellipsis whitespace-nowrap">
          {title}
        </p>

        <div className="flex flex-row items-center justify-center overflow-hidden">
          <ClockIcon size={13} className="w-6" />
          <p className="w-8 pr-1 text-sm">
            {entryMinutes < 10 ? `0${entryMinutes}` : entryMinutes}
          </p>
        </div>
      </div>
    </button>
  );
};

export { CalendarCard };
