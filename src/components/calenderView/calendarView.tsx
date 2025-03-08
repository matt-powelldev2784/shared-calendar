import { Button } from '@/components/ui/button';
import { addDays, format } from 'date-fns';
import CalendarIcon from '../../assets/icons/cal_icon.svg';
import DownIcon from '../../assets/icons/down_icon.svg';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import getCalendarEntries from '@/db/getCalendarEntries';
import type { CalendarEntry } from '@/ts/Calendar';
import { startOfDay, endOfDay } from 'date-fns';
import { CalendarCard } from '../ui/calendarCard';
import getFormattedCalendarData from '@/lib/getFormattedCalendarData';

type FetchCalendarEntriesInput = {
  date: Date;
  calendarId: string;
  daysVisible: number;
};

const fetchCalendarEntries = async ({
  date,
  calendarId,
  daysVisible,
}: FetchCalendarEntriesInput) => {
  const startDate = startOfDay(date);
  const endDate = endOfDay(addDays(date, daysVisible - 1));
  return getCalendarEntries({
    calendarIds: [calendarId],
    startDate,
    endDate,
  });
};

const VIEW_DAY = 1;
const VIEW_WEEK = 7;

export const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);
  const [daysVisible, setDaysVisible] = useState(VIEW_WEEK);
  const calendarId = 'yw1klS3kMHGXHFHeqaJ4';

  const { data, error, isLoading } = useQuery({
    queryKey: ['calendarEntries', calendarId, date.toISOString(), daysVisible],
    queryFn: () => fetchCalendarEntries({ date, calendarId, daysVisible }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const calendarData = getFormattedCalendarData({
    daysVisible,
    calendarData: data || [],
  });

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setIsSelectDateOpen(false);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="bg-primary/25 flex w-full items-center justify-center gap-4 p-2">
        <Popover open={isSelectDateOpen} onOpenChange={setIsSelectDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="datePicker" size="sm">
              <img
                src={CalendarIcon}
                alt="calendar"
                className="-w-5 mr-2 h-5"
              />

              {date ? format(date, 'dd MMMM yyyy') : <span>Pick a date</span>}

              <img src={DownIcon} alt="down" className="-w-5 h-5" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto">
            <Calendar
              mode="single"
              selected={date}
              onDateSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>

          <div className="absolute right-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:block"
              onClick={() => setDaysVisible(VIEW_DAY)}
            >
              Day View
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="hidden md:block"
              onClick={() => setDaysVisible(VIEW_WEEK)}
            >
              Week View
            </Button>
          </div>
        </Popover>
      </div>

      <section className="m-auto mx-4 mt-2 grid w-full grid-flow-row auto-row-[minmax(100px,1fr)] lg:auto-cols-[minmax(100px,1fr)] lg:grid-flow-col gap-2 px-4">
        {calendarData.map((entries, index) => {
          console.log('entries[0]', entries);
          
          return (
            <div
              key={index}
              className="flex flex-col flex-nowrap gap-2 lg:flex-col"
            >
              <p className="bg-zinc-400 p-2">{'test'}</p>
              {entries.map((entry: CalendarEntry) => (
                <CalendarCard key={entry.id} entry={entry} variant="purple" />
              ))}
            </div>
          );
        })}
      </section>

      {!data?.length && <div>No entries found</div>}
    </div>
  );
};
