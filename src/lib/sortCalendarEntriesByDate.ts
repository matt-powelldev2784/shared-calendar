// Querying entries from the database only returns a group of entries
// To render the calendar view, the following is required:
// - Calendar entries sorted into arrays by date and time
// - A date title for each day which is used to display a header row
//
// This function will return the calendar entries in a 2D array with the date title merged in.
// The 2D array will have the following structure:
// [
//   { date: Date, entries: CalendarEntry[] },
//   { date: Date, entries: CalendarEntry[] },
// ]

import type { CalendarEntry } from '@/ts/Calendar';
import { addDays, format } from 'date-fns';

type GetDatesToDisplay = {
  daysToReturn: number;
  calendarData: CalendarEntry[];
  firstDateToDisplay: Date;
};

const sortCalendarEntriesByDate = ({
  daysToReturn,
  calendarData,
  firstDateToDisplay,
}: GetDatesToDisplay) => {
  // initialize array where the length is the number of days to return
  const initializeDaysToReturn = Array.from(
    { length: daysToReturn },
    () => undefined,
  );

  // map the dates of the days to display
  const dateTitles: Date[] =
    initializeDaysToReturn.reduce((accumulator, _, index) => {
      if (index === 0) return [...accumulator, firstDateToDisplay];
      return [...accumulator, addDays(firstDateToDisplay, index)];
    }, [] as Date[]) || [];

  // merge the calendar entires with the days to display
  // this returns an array of objects with the date and the calendar entries for that date
  // dates without entries will will return an array with a date but no entries
  // the entries will then be sorted by start time
  const calendarEntries = dateTitles.map((date, index) => {
    const entries = calendarData
      .filter((entry) => format(date, 'd') === format(entry.startDate, 'd'))
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );

    return entries.length > 0
      ? { date: dateTitles[index], entries: [...entries] }
      : { date: dateTitles[index], entries: [] };
  });

  return calendarEntries;
};

export default sortCalendarEntriesByDate;
