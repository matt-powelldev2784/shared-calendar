import type { CalendarEntry, TimeslotEntry } from '@/ts/Calendar';
import { addDays, differenceInMinutes, format } from 'date-fns';

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

type GetTimeslotLength = {
  isFirstTimeslot: boolean;
  isLastTimeslot: boolean;
  startDate: Date;
  endDate: Date;
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

const getTimeslotLength = ({ isFirstTimeslot, isLastTimeslot, startDate, endDate }: GetTimeslotLength) => {
  const firstTimeslotLength = 60 - startDate.getMinutes();
  const lastTimeslotLength = endDate.getMinutes() === 0 ? 60 : endDate.getMinutes();
  const middleTimeslotLength = 60; //  for middle timeslots where entry spans multiple hours
  const isSingleTimeSlot = differenceInMinutes(endDate, startDate) < 60;
  if (isSingleTimeSlot) return differenceInMinutes(endDate, startDate);
  if (isFirstTimeslot) return firstTimeslotLength;
  if (isLastTimeslot) return lastTimeslotLength;
  return middleTimeslotLength;
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
      // get numbers of slots required for the entry
      const entryStartHour = entry.startDate.getHours();
      const entryEndHour = entry.endDate.getMinutes() === 0 ? entry.endDate.getHours() - 1 : entry.endDate.getHours();
      const numberOfHourTimeslots = entryEndHour - entryStartHour + 1;

      // add the timeslot length in minutes to the entry
      // this is used to calculate the height of the calendar card
      // add the entry to the timeslots
      Array.from({ length: numberOfHourTimeslots }).forEach((_, i) => {
        const hour = new Date(entry.startDate).getHours();
        const hourIndex = hour - startHour + i;

        // skip if the entry is before or after the requested hours
        if (hourIndex < 0 || hourIndex >= timeslots.length) return;

        // check if this is the first or last timeslot of the entry
        const isFirstTimeslot = i === 0;
        const isLastTimeslot = i === numberOfHourTimeslots - 1;

        // calculate the timeslot length in minutes
        const timeslotLength = getTimeslotLength({
          isFirstTimeslot,
          isLastTimeslot,
          startDate: entry.startDate,
          endDate: entry.endDate,
        });

        const entryWithTimeslotLength = {
          ...entry,
          timeslotLength,
        };

        // add the entry to the timeslot
        timeslots[hourIndex].entries.push(entryWithTimeslotLength);
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


