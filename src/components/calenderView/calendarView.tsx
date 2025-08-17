import { addDays, addWeeks, format, isSameDay, isToday, startOfWeek, subWeeks } from 'date-fns';
import { useState } from 'react';
import type { CalendarEntriesData, Timeslot, TimeslotHeaders, TimeslotEntry } from '@/ts/Calendar';
import { CalendarCard } from '../ui/calendarCard';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import { useResponsiveCalendarEntries } from '@/lib/useResponsiveCalendarEntries';
import { CalendarDays, ChevronLeft, ChevronRight, ChevronsDown, Clock } from 'lucide-react';
import {
  DEFAULT_DAYS_TO_VIEW,
  FULL_DAYS_END_HOUR,
  FULL_DAYS_START_HOUR,
  OFFICE_END_HOUR,
  OFFICE_START_HOUR,
} from '@/lib/globalVariables';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';

type CalendarViewProps = {
  calendarEntries: CalendarEntriesData[];
  timeslotHeaders: TimeslotHeaders[];
};

export const CalendarView = ({ calendarEntries, timeslotHeaders }: CalendarViewProps) => {
  const { selectedDate } = useSearch({ from: '/get-calendar' });
  const parsedSelectedDate = new Date(selectedDate);
  const responsiveCalendarEntries = useResponsiveCalendarEntries({ calendarEntries, selectedDate: parsedSelectedDate });

  return (
    <div className="flex w-full flex-col items-center justify-center pb-20">
      {/* Custom Date Selector */}
      <CustomDateSelector />

      <div className="flex w-full flex-row items-center justify-center">
        {/* Hour timeslots headers displayed to the left of calendar */}
        <section className="relative ml-3 flex h-full w-8 flex-col items-end sm:ml-4">
          {timeslotHeaders.map((timeslot) => (
            <TimeslotHeader key={timeslot.hour} {...timeslot} />
          ))}
        </section>

        {/* Calendar entries */}
        <section className="auto-row-[minmax(100px,1fr)] m-auto mt-0 mr-3 ml-3 grid w-full grid-flow-row lg:auto-cols-[minmax(100px,1fr)] lg:grid-flow-col">
          {responsiveCalendarEntries.map((calendarDay) => {
            return <CalendarDay key={calendarDay.date.toString()} {...calendarDay} />;
          })}
        </section>
      </div>
    </div>
  );
};

const TimeslotHeader = (timeslot: TimeslotHeaders) => {
  return (
    <p className="flex h-20 w-8 items-center justify-center border-b-1 border-gray-300 text-xs text-gray-900">
      {timeslot.hour.toString().padStart(2, '0')}
    </p>
  );
};

const CalendarDay = (calendarDay: CalendarEntriesData) => {
  const hourTimeslots = calendarDay.entries;

  return (
    <div className={`calendar-entry-bg flex flex-col flex-nowrap lg:flex-col`}>
      {/* Uncomment below to view calendar dates for each day */}
      {/* This can be used to check the date selector is matching the returned days */}
      {/* <div className="flex h-11 flex-col justify-center bg-blue-500 p-2 text-center font-bold text-white">
        <p className="h-4.5 text-[14px] lg:text-[13px] xl:text-[14px]">{format(calendarDay.date, 'EEEE')}</p>
        <p className="text-[15px] lg:hidden xl:block">{format(calendarDay.date, 'dd MMMM yyyy')}</p>
        <p className="hidden text-[14px] lg:block xl:hidden">{format(calendarDay.date, 'dd MMM yy')}</p>
      </div> */}

      {/* Calendar entries for each hour */}
      {hourTimeslots.map((hourTimeslot: Timeslot) => {
        const timeslotLength = hourTimeslot.entries.reduce((acc, entry) => {
          const entryLength = entry.timeslotLength;
          return acc + entryLength;
        }, 0);

        return (
          <div className="relative h-[80px] overflow-auto border-b-1 border-gray-300" key={hourTimeslot.hour}>
            {/* Arrow which displays in timeslot if it is scrollable u*/}
            {timeslotLength > 60 && (
              <ChevronsDown className="absolute top-15 right-0 z-10 w-3 text-blue-800 opacity-80" />
            )}

            {/* Calendar cards */}
            {hourTimeslot.entries.map((entry: TimeslotEntry) => {
              return <CalendarCard key={entry.id} entry={entry} variant="blue" />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export const CustomDateSelector = () => {
  const navigate = useNavigate();
  const { calendarIds, startHour, selectedDate } = useSearch({
    from: '/get-calendar',
  });
  const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);
  const parsedSelectedDate = new Date(selectedDate);
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(parsedSelectedDate, { weekStartsOn: 1 }));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => subWeeks(prev, 1));
    handleDateSelect(startOfWeek(subWeeks(currentWeek, 1), { weekStartsOn: 1 }));
  };

  const goToNextWeek = () => {
    setCurrentWeek((prev) => addWeeks(prev, 1));
    handleDateSelect(startOfWeek(addWeeks(currentWeek, 1), { weekStartsOn: 1 }));
  };

  const handleDateClick = (date: Date) => {
    handleDateSelect(date);
  };

  const handleDateSelect = (date: Date) => {
    const calendarUrl = getCalendarUrl({
      calendarIds: calendarIds,
      startHour,
      endHour: startHour === OFFICE_START_HOUR ? FULL_DAYS_END_HOUR : OFFICE_END_HOUR,
      daysToView: DEFAULT_DAYS_TO_VIEW,
      selectedDate: format(date, 'yyyy-MM-dd'),
    });
    navigate({ to: calendarUrl });
    setIsSelectDateOpen(false);
    setCurrentWeek(startOfWeek(date, { weekStartsOn: 1 }));
  };

  const toggleHoursToView = () => {
    const calendarUrl = getCalendarUrl({
      calendarIds: calendarIds,
      startHour: startHour === OFFICE_START_HOUR ? FULL_DAYS_START_HOUR : OFFICE_START_HOUR,
      endHour: startHour === OFFICE_START_HOUR ? FULL_DAYS_END_HOUR : OFFICE_END_HOUR,
      daysToView: DEFAULT_DAYS_TO_VIEW,
      selectedDate,
    });
    navigate({ to: calendarUrl });
  };

  return (
    <section className="bg-primary/10 w-full">
      {/* Week Selector Container */}
      <div className="border-primary/20 flex items-center justify-between px-4 py-1 md:py-2">
        {/* Go to previous week button*/}
        <button
          onClick={goToPreviousWeek}
          className="text-primary hover:bg-primary/15 flex h-8 w-8 items-center justify-center hover:rounded-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex flex-row items-center justify-center gap-4">
          {/* Clock button which which toggles hours to display. Toggles between office hours and 24 hour display */}
          <button
            className="bg-primary my-2 flex h-10 w-10 flex-col items-center justify-center rounded-lg p-2 text-[10px] font-bold text-white"
            onClick={toggleHoursToView}
          >
            <Clock className="text-white" />
          </button>

          <h2 className="text-primary text-xl font-semibold">{format(currentWeek, 'MMMM yyyy')}</h2>

          {/* Calendar icon button to open calendar date selector */}
          <Popover open={isSelectDateOpen} onOpenChange={setIsSelectDateOpen}>
            <PopoverTrigger className="bg-primary my-2 rounded-lg p-2">
              <CalendarDays size={24} className="text-white" />
            </PopoverTrigger>

            <PopoverContent>
              <Calendar
                mode="single"
                onSelect={(date) => date && handleDateSelect(date)}
                disabled={(date) => date < new Date('1900-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Go to next week button */}
        <button
          onClick={goToNextWeek}
          className="text-primary hover:bg-primary/15 flex h-8 w-8 items-center justify-center hover:rounded-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Date Selector Container */}
      <div className="relative flex w-full flex-row items-center justify-center">
        {/* Placeholder div to match position of calendar dates to calendar entries list */}
        <div className="ml-3 hidden w-8 sm:ml-4 md:block" />

        {/* Date Selector */}
        <section className="ml-[14px] md:auto-row-[minmax(100px,1fr)] m-auto mr-3 grid w-full grid-cols-7 md:grid-flow-row lg:auto-cols-[minmax(100px,1fr)] lg:grid-flow-col">
          {weekDays.map((day, index) => {
            const isCurrentDay = isToday(day);
            const isSelectedDay = isSameDay(day, selectedDate);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={`relative flex flex-col items-center justify-center p-1 transition-all duration-200 focus:outline-none md:p-2 ${isSelectedDay && 'bg-primary text-white'} ${!isSelectedDay && 'hover:bg-primary/15'}`}
              >
                {/* Day name */}
                <span className="text-[10px] uppercase md:text-sm">{format(day, 'EEE')}</span>

                {/* Day number */}
                <span className="mb-1 text-sm font-semibold md:text-lg">{format(day, 'd')}</span>

                {/* Today indicator dot */}
                {isCurrentDay && (
                  <div className="absolute bottom-[4px] h-1 w-1 rounded-full bg-red-500 md:bottom-[6px] md:h-1.5 md:w-1.5" />
                )}
              </button>
            );
          })}
        </section>
      </div>
    </section>
  );
};
