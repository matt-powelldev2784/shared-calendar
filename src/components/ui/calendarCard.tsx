import { format } from "date-fns";
import { ClockIcon } from "lucide-react";

const variantClasses = {
  default: 'w-full flex flex-row gap-2 h-20 items-center sm:rounded-md text-sm',
  pink: 'bg-lightPink text-darkPink',
  green: 'bg-lightGreen  text-darkGreen',
  purple: 'bg-lightPurple text-darkPurple',
  blue: 'bg-lightBlue text-darkBlue',
  yellow: 'bg-lightYellow text-darkYellow',
};

const dateIconClasses = {
  default:
    'text-white w-14 h-14 flex flex-col items-center justify-center rounded-full ml-2',
  pink: 'bg-darkPink',
  green: 'bg-darkGreen',
  purple: 'bg-darkPurple',
  blue: 'bg-darkBlue',
  yellow: 'bg-darkYellow',
};

interface CalendarCardProps {
  entry: {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
  };
  variant: keyof typeof variantClasses;
}

const CalendarCard = ({ entry, variant }: CalendarCardProps) => {
  const { title, startDate, endDate } = entry;
  return (
    <article className={`${variantClasses.default} ${variantClasses[variant]}`}>
      <div className={`${dateIconClasses.default} ${dateIconClasses[variant]}`}>
        <p className="h-4 text-sm">{format(startDate, 'dd')}</p>
        <p className="text-sm">{format(startDate, 'MMM')}</p>
      </div>

      <div>
        <h3 className={'text-lg font-bold'}>{title}</h3>

        <p className={'flex flex-row items-center gap-2'}>
          <ClockIcon size={16} />
          {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
        </p>
      </div>
    </article>
  );
};



export { CalendarCard };
