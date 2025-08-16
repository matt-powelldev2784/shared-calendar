import { Button } from '@/components/ui/button';
import { addDays, addWeeks, format, isSameDay, isToday, startOfWeek, subWeeks } from 'date-fns';
import { useState } from 'react';
import type { CalendarEntriesData, Timeslot, TimeslotHeaders, TimeslotEntry } from '@/ts/Calendar';
import { CalendarCard } from '../ui/calendarCard';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import { useResponsiveCalendarEntries } from '@/lib/useResponsiveCalendarEntries';
import { ChevronLeft, ChevronRight, ChevronsDown, Clock } from 'lucide-react';
import { getResponsiveStartDate } from '@/lib/getResponsiveStartDate';
import {
  DEFAULT_DAYS_TO_VIEW,
  FULL_DAYS_END_HOUR,
  FULL_DAYS_START_HOUR,
  OFFICE_END_HOUR,
  OFFICE_START_HOUR,
  smallScreenSize,
} from '@/lib/globalVariables';

type CalendarViewProps = {
  calendarEntries: CalendarEntriesData[];
  timeslotHeaders: TimeslotHeaders[];
};

export const CalendarView = ({ calendarEntries, timeslotHeaders }: CalendarViewProps) => {
  const { calendarIds, startHour, endHour, selectedDate } = useSearch({
    from: '/get-calendar',
  });
  const parsedSelectedDate = new Date(selectedDate)
  const isSmallScreen = window.innerWidth < smallScreenSize;
  const navigate = useNavigate();
  const responsiveCalendarEntries = useResponsiveCalendarEntries(calendarEntries);

  const handleDateSelect = (selectedDate: Date) => {
    const calendarUrl = getCalendarUrl({
      calendarIds: calendarIds,
      startDate: getResponsiveStartDate(isSmallScreen, selectedDate),
      daysToView: DEFAULT_DAYS_TO_VIEW,
      startHour,
      endHour,
      selectedDate: format(selectedDate, 'yyyy-MM-dd'),
    });
    navigate({ to: calendarUrl });
  };

  const toggleHoursToView = () => {
    const calendarUrl = getCalendarUrl({
      calendarIds: calendarIds,
      startDate: format(parsedSelectedDate, 'yyyy-MM-dd'),
      startHour: startHour === OFFICE_START_HOUR ? FULL_DAYS_START_HOUR : OFFICE_START_HOUR,
      endHour: startHour === OFFICE_START_HOUR ? FULL_DAYS_END_HOUR : OFFICE_END_HOUR,
      daysToView: DEFAULT_DAYS_TO_VIEW,
      selectedDate,
    });
    navigate({ to: calendarUrl });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center pb-20">
      {/* Custom Date Selector */}
      <CustomDateSelector selectedDate={parsedSelectedDate} handleDateSelect={handleDateSelect} />

      <div className="flex w-full flex-row items-center justify-center">
        {/* Hour timeslots headers displayed to the left of calendar */}
        <section className="relative ml-3 flex h-full w-8 flex-col items-end sm:ml-4">
          <Button
            variant="default"
            className="absolute top-2 -left-1 flex h-11 w-10 flex-col items-center justify-center gap-0 text-[10px] leading-tight"
            onClick={toggleHoursToView}
          >
            <Clock size={2} />
            <span>{`${String(startHour).padStart(2, '0')}:00`}</span>
            <span>{`${String(endHour + 1).padStart(2, '0')}:00`}</span>
          </Button>

          <div className="mt-13">
            {timeslotHeaders.map((timeslot) => (
              <TimeslotHeader key={timeslot.hour} {...timeslot} />
            ))}
          </div>
        </section>

        {/* Calendar entries */}
        <section className="auto-row-[minmax(100px,1fr)] m-auto mt-2 mr-3 ml-3 grid w-full grid-flow-row gap-2 lg:auto-cols-[minmax(100px,1fr)] lg:grid-flow-col">
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
  const { date } = calendarDay;
  const hourTimeslots = calendarDay.entries;

  return (
    <div className={`calendar-entry-bg flex flex-col flex-nowrap lg:flex-col`}>
      <div className="flex h-11 flex-col justify-center bg-blue-500 p-2 text-center font-bold text-white">
        <p className="h-4.5 text-[14px] lg:text-[13px] xl:text-[14px]">{format(date, 'EEEE')}</p>
        <p className="text-[15px] lg:hidden xl:block">{format(date, 'dd MMMM yyyy')}</p>
        <p className="hidden text-[14px] lg:block xl:hidden">{format(date, 'dd MMM yy')}</p>
      </div>

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

interface CustomDateSelectorProps {
  selectedDate: Date;
  handleDateSelect: (date: Date) => void;
}

export const CustomDateSelector = ({ selectedDate, handleDateSelect }: CustomDateSelectorProps) => {
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(selectedDate, { weekStartsOn: 1 }));

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

  return (
    <div className="bg-primary/25 w-full">
      {/* Month/Year Header */}
      <div className="border-primary/20 flex items-center justify-between px-4 py-1">
        <button
          onClick={goToPreviousWeek}
          className="text-primary hover:bg-primary/10 flex h-8 w-8 items-center justify-center hover:rounded-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <h2 className="text-primary text-xl font-semibold">{format(currentWeek, 'MMMM yyyy')}</h2>

        <button
          onClick={goToNextWeek}
          className="text-primary hover:bg-primary/10 flex h-8 w-8 items-center justify-center hover:rounded-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Days Grid */}
      <div className="flex w-full flex-row items-center justify-center">
        {/* Placeholder div to match timeslot header section exactly */}
        <div className="ml-3 w-8 sm:ml-4" />

        {/* Date Selector */}
        <section className="auto-row-[minmax(100px,1fr)] m-auto mr-3 ml-3 grid w-full grid-flow-col gap-2 lg:auto-cols-[minmax(100px,1fr)]">
          {weekDays.map((day, index) => {
            const isCurrentDay = isToday(day);
            const isSelectedDay = isSameDay(day, selectedDate);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={`relative flex flex-col items-center justify-center p-3 transition-all duration-200 ${isSelectedDay && 'bg-primary text-white'} ${!isSelectedDay && 'hover:bg-primary/15'}`}
              >
                {/* Day name */}
                <span className="mb-1 text-xs tracking-wide uppercase">{format(day, 'EEE')}</span>

                {/* Day number */}
                <span className="text-lg font-semibold">{format(day, 'd')}</span>

                {/* Today indicator dot */}
                {isCurrentDay && <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-red-500" />}
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
};