import type { CalendarEntry } from '@/ts/Calendar';
import { addDays, format } from 'date-fns';

type GetDatesToDisplay = {
  daysToReturn: number;
  calendarData: CalendarEntry[];
  firstDateToDisplay: Date;
};

interface DayPlusDateString {
  dayNumber: number;
  date: Date;
}

const sortCalendarEntriesByDate = ({
  daysToReturn,
  calendarData,
  firstDateToDisplay,
}: GetDatesToDisplay) => {
  // format the first day object with a date string and day in a number format
  const firstDay: DayPlusDateString = {
    date: firstDateToDisplay,
    dayNumber: Number(format(firstDateToDisplay, 'd')),
  };

  // initialize and fill an array of dates
  // this cam be used to display the calendar day titles
  const dateTitles: DayPlusDateString[] = [];
  for (let i = 0; i < daysToReturn - 1; i++) {
    if (i === 0) {
      dateTitles.push(firstDay);
    }

    const previousDate = dateTitles[dateTitles.length - 1].date;
    const nextDate = addDays(previousDate, 1);
    dateTitles.push({
      dayNumber: Number(format(nextDate, 'd')),
      date: nextDate,
    });
  }

  // return an array of objects with the date and the calendar entries for that date
  // date without entries will will return an array with a date but no entries
  const calendarEntries = dateTitles.map((dateTitle, index) => {
    const entries = calendarData.filter((entry) => {
      return format(dateTitle.date, 'd') === format(entry.startDate, 'd');
    });

    return entries.length > 0
      ? { date: dateTitles[index].date, entries: [...entries] }
      : { date: dateTitles[index].date, entries: [] };
  });

  return calendarEntries;
};

export default sortCalendarEntriesByDate;
