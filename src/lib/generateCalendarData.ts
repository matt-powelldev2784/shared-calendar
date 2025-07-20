import type { CalendarEntry, TimeslotEntry } from '@/ts/Calendar';
import { addDays, addMinutes, differenceInMinutes, format } from 'date-fns';

type GenerateCalendarData = {
  daysToReturn: number;
  calendarData: CalendarEntry[];
  firstDateToDisplay: Date;
  startHour: number;
  endHour: number;
};

const generateCalendarData = ({
  daysToReturn,
  calendarData,
  firstDateToDisplay,
  startHour,
  endHour,
}: GenerateCalendarData) => {
  const calendarDates = generateCalendarDates({
    daysToReturn,
    firstDateToDisplay,
  });

  const calendarEntries = calendarDates.map((date) => {
    return {
      date,
      entries: addCalendarDayToTimeslots({
        calendarData,
        date,
        startHour,
        endHour,
      }),
    };
  });

  const timeslotHeaders = generateTimeslotHeaders({ startHour, endHour });

  return { calendarEntries, timeslotHeaders };
};

export default generateCalendarData;

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

type GenerateCalendarDates = {
  daysToReturn: number;
  firstDateToDisplay: Date;
};

type AddCalendarEntryToTimeslot = {
  calendarData: CalendarEntry[];
  date: Date;
  startHour: number;
  endHour: number;
};

type GetHourTimeslots = {
  startHour: number;
  endHour: number;
};

type GenerateTimeslotHeaders = {
  startHour: number;
  endHour: number;
};

export const generateCalendarDates = ({ daysToReturn, firstDateToDisplay }: GenerateCalendarDates) => {
  return Array.from({ length: daysToReturn }, (_, index) => addDays(firstDateToDisplay, index));
};

export const getHourTimeslots = ({ startHour, endHour }: GetHourTimeslots) => {
  const hoursToDisplay = endHour - startHour + 1;
  return Array.from({ length: hoursToDisplay }).map((_, i) => ({
    hour: startHour + i,
    entries: [] as TimeslotEntry[],
  }));
};

// adds one day's worth of calendar entries to the timeslots
export const addCalendarDayToTimeslots = ({ calendarData, date, startHour, endHour }: AddCalendarEntryToTimeslot) => {
  // generate the timeslots for the day
  const timeslots = getHourTimeslots({ startHour, endHour });

  // add the calendar entries to the timeslots
  calendarData
    .filter((entry) => format(date, 'd') === format(entry.startDate, 'd'))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .forEach((entry) => {
      const hour = new Date(entry.startDate).getHours();
      const hourIndex = hour - startHour;
      const entryLength = differenceInMinutes(entry.endDate, entry.startDate);
      const numberOfHourTimeslots = Math.ceil(entryLength / 60);

      // add the timeslot length in minutes to the entry
      // this is used to calculate the height of the calendar card
      Array.from({ length: numberOfHourTimeslots }).forEach((_, i) => {
        const nextHourIndex = hourIndex + i;

        // skip if the entry is before or after the displayed hours
        if (nextHourIndex < 0 || nextHourIndex >= timeslots.length) return;

        const isLastTimeslot = numberOfHourTimeslots === i + 1;
        // if the data is for last timeslot for the current entry, calculate the timeslot length
        // otherwise the timeslot length is will always be 60 minutes
        // this is used to generate entries that span over multiple hours
        const timeslotLength = isLastTimeslot
          ? differenceInMinutes(entry.endDate, addMinutes(entry.startDate, i * 60))
          : 60;

        const entryWithTimeslotLength = {
          ...entry,
          timeslotLength,
        };
        timeslots[nextHourIndex].entries.push(entryWithTimeslotLength);
      });
    });

  return timeslots;
};

const generateTimeslotHeaders = ({ startHour, endHour }: GenerateTimeslotHeaders) => {
  const hoursToDisplay = endHour - startHour + 1;
  const timeslots = Array.from({ length: hoursToDisplay }).map((_, i) => ({
    hour: startHour + i,
  }));

  return timeslots;
};
