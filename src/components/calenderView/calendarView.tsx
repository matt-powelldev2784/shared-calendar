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

type CalendarViewProps = {
  calendarEntries: CalendarEntriesData[];
  timeslotHeaders: TimeslotHeaders[];
};

const OFFICE_START_HOUR = 8;
const OFFICE_END_HOUR = 17;
const FULL_DAYS_START_HOUR = 0;
const FULL_DAYS_END_HOUR = 23;

export const CalendarView = ({ calendarEntries, timeslotHeaders }: CalendarViewProps) => {
  const { calendarIds, startDate, startHour, endHour } = useSearch({
    from: '/get-calendar',
  });
  const date = new Date(startDate);
  const navigate = useNavigate();
  const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);
  const responsiveCalendarEntries = useResponsiveCalendarEntries(calendarEntries);

  const handleDateSelect = (selectedDate: Date) => {
    setIsSelectDateOpen(false);
    const calendarUrl = getCalendarUrl({
      calendarIds: calendarIds,
      startDate: format(selectedDate, 'yyyy-MM-dd'),
      daysToView: 7,
    });
    navigate({
      to: calendarUrl,
    });
  };

  const toggleHoursToView = () => {
    const calendarUrl = getCalendarUrl({
      calendarIds: calendarIds,
      startDate: format(date, 'yyyy-MM-dd'),
      startHour: startHour === OFFICE_START_HOUR ? FULL_DAYS_START_HOUR : OFFICE_START_HOUR,
      endHour: startHour === OFFICE_START_HOUR ? FULL_DAYS_END_HOUR : OFFICE_END_HOUR,
      daysToView: 7,
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
        {/* This is the hours toggle button displayed on the left side of the calendar view */}
        <section className="relative mt-2 ml-3 flex h-full w-8 flex-col items-end sm:ml-4">
          <Button
            variant="default"
            className="absolute -left-1 flex h-11 w-10 flex-col items-center justify-center gap-0 text-[10px] leading-tight"
            onClick={toggleHoursToView}
          >
            <Clock size={2} />
            <span>{`${String(startHour).padStart(2, '0')}:00`}</span>
            <span>{`${String(endHour + 1).padStart(2, '0')}:00`}</span>
          </Button>

          {/* Spacer to line up the calendar timeslots with the calendar */}
          <div className="mt-11"></div>

          {/* This is the hour timeslots displayed down the left hand side */}
          {timeslotHeaders.map((timeslot) => (
            <p
              key={timeslot.hour}
              className="flex h-20 w-8 items-center justify-center border-b-1 border-gray-300 text-xs text-gray-900"
            >
              {timeslot.hour.toString().padStart(2, '0')}
            </p>
          ))}
        </section>

        {/* This is the calendar days displayed in a grid layout */}
        <section className="auto-row-[minmax(100px,1fr)] m-auto mt-2 mr-3 ml-3 grid w-full grid-flow-row gap-2 lg:auto-cols-[minmax(100px,1fr)] lg:grid-flow-col">
          {responsiveCalendarEntries.map((calendarDay, index) => {
            const { date } = calendarDay;
            const hourTimeslots = calendarDay.entries;
            const backgroundColor = index % 2 === 0 ? 'bg-gray-100' : 'bg-white';

            return (
              <div key={date.toISOString()} className={`flex flex-col flex-nowrap lg:flex-col ${backgroundColor}`}>
                <div className="flex h-11 flex-col justify-center bg-blue-500 p-2 text-center font-bold text-white">
                  <p className="h-4.5 text-[14px] lg:text-[13px] xl:text-[14px]">{format(date, 'EEEE')}</p>
                  <p className="text-[15px] lg:hidden xl:block">{format(date, 'dd MMMM yyyy')}</p>
                  <p className="hidden text-[14px] lg:block xl:hidden">{format(date, 'dd MMM yy')}</p>
                </div>

                {/* This is the calendar entries for each hour */}
                {hourTimeslots.map((hourTimeslot: Timeslot) => {
                  const timeslotLength = hourTimeslot.entries.reduce((acc, entry) => {
                    const entryLength = entry.timeslotLength;
                    return acc + entryLength;
                  }, 0);

                  return (
                    <div
                      className="relative h-[80px] overflow-auto border-b-1 border-gray-300"
                      key={`${hourTimeslot.hour - startHour}}`}
                    >
                      {/* Display arrow to show timeslot is scrollable if more than 4 entries*/}
                      {timeslotLength > 60 && (
                        <ChevronsDown className="absolute top-15 right-0 z-10 w-3 text-blue-800 opacity-80" />
                      )}

                      {/* Calendar card for each calendar entry */}
                      {hourTimeslot.entries.map((entry: TimeslotEntry) => {
                        return <CalendarCard key={hourTimeslot.hour + '-' + entry.id} entry={entry} variant="blue" />;
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

