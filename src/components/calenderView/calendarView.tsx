import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import CalendarIcon from '../../assets/icons/cal_icon.svg';
import DownIcon from '../../assets/icons/down_icon.svg';
import { Calendar as CustomCalendar } from '@/components/ui/customCalendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import type { CalendarEntriesData, Timeslot, TimeslotHeaders, TimeslotEntry } from '@/ts/Calendar';
import { CalendarCard } from '../ui/calendarCard';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import { useResponsiveCalendarEntries } from '@/lib/useResponsiveCalendarEntries';
import { ChevronsDown, Clock } from 'lucide-react';
import { getResponsiveStartDate } from '@/lib/getResponsiveStartDate';
import { DEFAULT_DAYS_TO_VIEW, FULL_DAYS_END_HOUR, FULL_DAYS_START_HOUR, OFFICE_END_HOUR, OFFICE_START_HOUR, smallScreenSize } from '@/lib/globalVariables';

type CalendarViewProps = {
  calendarEntries: CalendarEntriesData[];
  timeslotHeaders: TimeslotHeaders[];
};

export const CalendarView = ({ calendarEntries, timeslotHeaders }: CalendarViewProps) => {
  const { calendarIds, startDate, startHour, endHour } = useSearch({
    from: '/get-calendar',
  });
  const date = new Date(startDate);
  const isSmallScreen = window.innerWidth < smallScreenSize;
  const navigate = useNavigate();
  const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);
  const responsiveCalendarEntries = useResponsiveCalendarEntries(calendarEntries);

  const handleDateSelect = (selectedDate: Date) => {
    setIsSelectDateOpen(false);
    const calendarUrl = getCalendarUrl({
      calendarIds: calendarIds,
      startDate: getResponsiveStartDate(isSmallScreen, selectedDate),
      daysToView: DEFAULT_DAYS_TO_VIEW,
      startHour,
      endHour,
    });
    navigate({ to: calendarUrl });
  };

  const toggleHoursToView = () => {
    const calendarUrl = getCalendarUrl({
      calendarIds: calendarIds,
      startDate: format(date, 'yyyy-MM-dd'),
      startHour: startHour === OFFICE_START_HOUR ? FULL_DAYS_START_HOUR: OFFICE_START_HOUR,
      endHour: startHour === OFFICE_START_HOUR ? FULL_DAYS_END_HOUR : OFFICE_END_HOUR,
      daysToView: DEFAULT_DAYS_TO_VIEW,
    });
    navigate({ to: calendarUrl });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center pb-20">
      {/* Date Selector */}
      <div className="bg-primary/25 z-100s relative flex h-13 w-full items-center justify-center gap-4 p-2">
        <Popover open={isSelectDateOpen} onOpenChange={setIsSelectDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="datePicker" className="w-96">
              <img src={CalendarIcon} alt="calendar" className="-w-5 mr-2 h-5" />
              {date ? format(date, 'dd MMMM yyyy') : <span>Pick a date</span>}
              <img src={DownIcon} alt="down" className="-w-5 h-5" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto">
            <CustomCalendar mode="single" selected={date} onDateSelect={handleDateSelect} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

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
