import type { CalendarEntry } from '@/ts/Calendar';
import { addDays, format } from 'date-fns';

type GetDatesToDisplay = {
  daysVisible: number;
  calendarData: CalendarEntry[];
  firstDateToDisplay: Date;
};

const getFormattedCalendarData = ({
  daysVisible,
  calendarData,
  firstDateToDisplay,
}: GetDatesToDisplay) => {
  const datesFromCalendar =
    calendarData
      .map((entry) => {
        return Number(format(entry.startDate, 'd'));
      })
      .sort() || [];

  const firstUniqueDate = Number(format(firstDateToDisplay, 'd'));
  const uniqueDates = new Set(datesFromCalendar);
  const uniqueDateArray = [...uniqueDates];
  const sequentialUniqueDates: number[] = [firstUniqueDate];

  for (let i = 0; i < daysVisible - 1; i++) {
    if (sequentialUniqueDates.length === 0) {
      sequentialUniqueDates.push(uniqueDateArray[i]);
    }

    const isNumberInSequence =
      sequentialUniqueDates[sequentialUniqueDates.length - 1] + 1 ===
      uniqueDateArray[i];

    if (isNumberInSequence) {
      sequentialUniqueDates.push(uniqueDateArray[i]);
    } else {
      const nextNumber =
        sequentialUniqueDates[sequentialUniqueDates.length - 1] + 1;
      sequentialUniqueDates.push(nextNumber);
    }
  }

  const dateTitles = Array.from({ length: daysVisible }, (_, i) => {
    const date = addDays(firstDateToDisplay, i);
    return format(date, 'dd MMMM yyyy');
  });

  const calendarEntries = sequentialUniqueDates.map((date, index) => {
    const entries = calendarData.filter((entry) => {
      return Number(format(entry.startDate, 'd')) === date;
    });

    return entries.length > 0
      ? { date: dateTitles[index], entries: [...entries] }
      : { date: dateTitles[index], entries: [] };
  });

  return calendarEntries;
};

export default getFormattedCalendarData;
