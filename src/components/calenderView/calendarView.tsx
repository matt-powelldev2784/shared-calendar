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
import sortCalendarEntriesByDate from '@/lib/sortCalendarEntriesByDate';

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

export const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);
  const daysVisible = 7;
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

  const calendarData = sortCalendarEntriesByDate({
    daysToReturn: daysVisible,
    calendarData: data || [],
    firstDateToDisplay: date,
  });

  console.log('calendarData',calendarData)

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setIsSelectDateOpen(false);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="relative bg-primary/25 flex w-full items-center justify-center gap-4 p-2 z-100s">
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
        </Popover>
      </div>

      <section className="auto-row-[minmax(100px,1fr)] m-auto mx-4 mt-2 grid w-full grid-flow-row gap-2 px-4 lg:auto-cols-[minmax(100px,1fr)] lg:grid-flow-col">
        {calendarData.map((calendarData, index) => {
          const { entries, date } = calendarData;
          return (
            <div
              key={index}
              className="mb-2 flex flex-col flex-nowrap gap-1 lg:flex-col"
            >
              <div className="flex h-11 flex-col justify-center bg-zinc-400 p-2 text-center font-bold text-white">
                <p className="h-4.5 text-[14px] lg:text-[13px] xl:text-[14px]">
                  {format(date, 'EEEE')}
                </p>
                <p className="text-[15px] lg:hidden xl:block">{format(date,'dd MMMM yyyy')}</p>
                <p className="hidden text-[14px] lg:block xl:hidden">
                  {format(date, 'dd MMM yy')}
                </p>
              </div>

              {!entries.length && (
                <p className="flex h-14 -translate-y-1 items-center justify-center bg-zinc-100 p-2 text-center text-sm">
                  No calendar entries today
                </p>
              )}

              {entries.map((entry: CalendarEntry) => {
                return (
                  <CalendarCard key={entry.id} entry={entry} variant="purple" />
                );
              })}
            </div>
          );
        })}
      </section>

      {!data?.length && <div>No entries found</div>}
    </div>
  );
};
