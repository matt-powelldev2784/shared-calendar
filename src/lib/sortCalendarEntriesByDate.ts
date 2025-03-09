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
  // this cam be used to display the calendar day titles
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
  const calendarEntries = dateTitles.map((date, index) => {
    const entries = calendarData.filter((entry) => {
      return format(date, 'd') === format(entry.startDate, 'd');
    });

    return entries.length > 0
      ? { date: dateTitles[index], entries: [...entries] }
      : { date: dateTitles[index], entries: [] };
  });

  return calendarEntries;
};

export default sortCalendarEntriesByDate;
