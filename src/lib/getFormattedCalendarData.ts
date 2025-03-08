import type { CalendarEntry } from '@/ts/Calendar';
import { format } from 'date-fns';

type GetDatesToDisplay = {
  daysVisible: number;
  calendarData: CalendarEntry[];
};

const getFormattedCalendarData = ({
  daysVisible,
  calendarData,
}: GetDatesToDisplay) => {
  const startDates =
    calendarData.map((entry) => {
      return Number(format(entry.startDate, 'd'));
    }) || [];

  const uniqueDates = new Set(startDates);
  const uniqueDateArray = [...uniqueDates];
  const sequentialUniqueDates: number[] = [];

  if (uniqueDateArray.length === 0) return [];

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

  const calendarEntries = sequentialUniqueDates.map((date) => {
    const entries = calendarData.filter((entry) => {
      return Number(format(entry.startDate, 'd')) === date;
    });

    return entries.length > 0 ? [...entries] : [];
  });

  return calendarEntries;
};

export default getFormattedCalendarData;
