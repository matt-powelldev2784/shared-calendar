import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import CalendarIcon from '../../assets/icons/cal_icon.svg';
import DownIcon from '../../assets/icons/down_icon.svg';
import { Calendar as CustomCalendar } from '@/components/ui/customCalendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import type {
  CalendarEntry,
  CalendarEntriesData,
  Timeslot,
} from '@/ts/Calendar';
import { CalendarCard } from '../ui/calendarCard';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { getCalendarUrl } from '@/lib/getCalendarUrl';

type CalendarViewProps = {
  calendarEntries: CalendarEntriesData[];
};

export const CalendarView = ({ calendarEntries }: CalendarViewProps) => {
  const { calendarIds, startDate } = useSearch({ from: '/get-calendar' });
  const date = new Date(startDate);
  const navigate = useNavigate();
  const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date) => {
    setIsSelectDateOpen(false);
    const calendarUrl = getCalendarUrl({
      calendarIds: calendarIds,
      startDate: format(selectedDate, 'yyyy-MM-dd'),
    });
    navigate({
      to: calendarUrl,
    });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="bg-primary/25 z-100s relative flex h-13 w-full items-center justify-center gap-4 p-2">
        <Popover open={isSelectDateOpen} onOpenChange={setIsSelectDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="datePicker" className="w-96">
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
            <CustomCalendar
              mode="single"
              selected={date}
              onDateSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <section className="auto-row-[minmax(100px,1fr)] m-auto mx-4 mt-2 grid w-full grid-flow-row gap-2 px-4 lg:auto-cols-[minmax(100px,1fr)] lg:grid-flow-col">
        {calendarEntries.map((calendarDay, index) => {
          const { date } = calendarDay;
          const hourTimeslots = calendarDay.entries;
          console.log('hourTimeslots', hourTimeslots);
          return (
            <div
              key={index}
              className="mb-2 flex flex-col flex-nowrap gap-1 lg:flex-col"
            >
              <div className="flex h-11 flex-col justify-center bg-zinc-400 p-2 text-center font-bold text-white">
                <p className="h-4.5 text-[14px] lg:text-[13px] xl:text-[14px]">
                  {format(date, 'EEEE')}
                </p>
                <p className="text-[15px] lg:hidden xl:block">
                  {format(date, 'dd MMMM yyyy')}
                </p>
                <p className="hidden text-[14px] lg:block xl:hidden">
                  {format(date, 'dd MMM yy')}
                </p>
              </div>

              {hourTimeslots.map((hourTimeSlot: Timeslot) => {
                console.log('hourTimeSlot', hourTimeSlot);

                // Render each hour's entries as CalendarCard components
                if (!hourTimeSlot.entries.length) {
                  return (
                    <p
                      key={hourTimeSlot.hour}
                      className="bg-lightPink text-darkPink flex h-14 w-full cursor-pointer flex-row items-center gap-1"
                    >
                      No calendar for this hour {hourTimeSlot.hour}:00
                    </p>
                  );
                }

                return hourTimeSlot.entries.map((entry: CalendarEntry) => {
                  console.log('entry', entry);

                  // If there are entries, render them as CalendarCard components
                  return (
                    <CalendarCard
                      key={hourTimeSlot.hour + '-' + entry.id}
                      entry={entry}
                      variant="purple"
                    />
                  );
                });
              })}
            </div>
          );
        })}
      </section>
    </div>
  );
};

