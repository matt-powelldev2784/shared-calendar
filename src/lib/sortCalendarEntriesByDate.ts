// Querying entries from the database only returns a group of entries
// To render the calendar view, the following is required:
// - Calendar entries sorted into arrays by date
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
  // initialize and fill an array of dates
  // this cam be used to display the calendar day titles{}
  const dateTitles: Date[] = [];
  for (let i = 0; i < daysToReturn; i++) {
    // push first date in to date titles array and move to next iteration
    if (i === 0) {
      dateTitles.push(firstDateToDisplay);
      continue;
    }

    // push the next date in to the date titles array
    const previousDate = dateTitles[dateTitles.length - 1];
    const nextDate = addDays(previousDate, 1);
    dateTitles.push(nextDate);
  }

  // return an array of objects with the date and the calendar entries for that date
  // dates without entries will will return an array with a date but no entries
  // the entries will then be sorted by start time
  const calendarEntries = dateTitles.map((date, index) => {
    const entries = calendarData
      .filter((entry) => format(date, 'd') === format(entry.startDate, 'd'))
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );

    console.log('entries', entries);

    return entries.length > 0
      ? { date: dateTitles[index], entries: [...entries] }
      : { date: dateTitles[index], entries: [] };
  });

  return calendarEntries;
};

export default sortCalendarEntriesByDate;
