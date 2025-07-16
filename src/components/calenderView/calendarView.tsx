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
  TimeslotHeaders,
} from '@/ts/Calendar';
import { CalendarCard } from '../ui/calendarCard';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import { useDaysToViewResizeForSmallScreens } from '@/lib/useDaysToViewResizeForSmallScreens';

type CalendarViewProps = {
  calendarEntries: CalendarEntriesData[];
  timeslotHeaders: TimeslotHeaders[];
};

export const CalendarView = ({
  calendarEntries,
  timeslotHeaders,
}: CalendarViewProps) => {
  const { calendarIds, startDate } = useSearch({ from: '/get-calendar' });
  const date = new Date(startDate);
  const navigate = useNavigate();
  const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);
  useDaysToViewResizeForSmallScreens();

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
    <div className="flex w-full flex-col items-center justify-center pb-20">
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

      <div className="flex w-full flex-row items-center justify-center">
        {/* This is the hours displayed on the left side of the calendar view */}
        <section className="mt-2 ml-4 flex h-full w-8 flex-col items-end">
          <div className="h-11"></div>
          {timeslotHeaders.map((timeslot) => (
            <p
              key={timeslot.hour}
              className="flex h-20 w-8 items-center justify-center border-b-1 text-xs text-gray-500"
            >
              {timeslot.hour.toString().padStart(2, '0')}
            </p>
          ))}
        </section>

        {/* This is the main calendar view which displays thea appointments */}
        <section className="auto-row-[minmax(100px,1fr)] m-auto mt-2 mr-4 grid w-full grid-flow-row gap-2 px-4 lg:auto-cols-[minmax(100px,1fr)] lg:grid-flow-col">
          {calendarEntries.map((calendarDay) => {
            const { date } = calendarDay;
            const hourTimeslots = calendarDay.entries;

            return (
              <div
                key={date.toISOString()}
                className="flex flex-col flex-nowrap lg:flex-col"
              >
                <div className="flex h-11 flex-col justify-center bg-blue-400 p-2 text-center font-bold text-white">
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
                  const numberOfEntries = hourTimeSlot.numberOfEntries;

                  return (
                    <div
                      className="relative h-20 overflow-clip border-b-1 border-gray-200"
                      key={`${hourTimeSlot.hour}`}
                    >
                      {/* A maximum of 4 entries can be displayed per hour in the calendar view */}
                      {/* If there are more than 4 entries in a hour display button to view all entires */}
                      {numberOfEntries > 4 && (
                        <button className="absolute top-0 right-0 z-2 h-20 w-24 cursor-pointer bg-blue-800 p-2 text-xs text-white">
                          {numberOfEntries} entries in this timeslot. Click here
                          to expand.
                        </button>
                      )}

                      {/* Calendar card for each calendar entry */}
                      {hourTimeSlot.entries.map((entry: CalendarEntry) => {
                        return (
                          <CalendarCard
                            key={hourTimeSlot.hour + '-' + entry.id}
                            entry={entry}
                            numberOfEntries={numberOfEntries}
                            variant="blue"
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

