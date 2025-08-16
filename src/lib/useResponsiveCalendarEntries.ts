import type { CalendarEntriesData } from '@/ts/Calendar';
import { useEffect, useState } from 'react';
import { smallScreenSize } from './globalVariables';
import { format } from 'date-fns';

interface UseResponsiveCalendarEntriesProps {
  calendarEntries: CalendarEntriesData[];
  selectedDate: Date;
}

export function useResponsiveCalendarEntries({ calendarEntries, selectedDate }: UseResponsiveCalendarEntriesProps) {
  const [filteredEntries, setFilteredEntries] = useState(calendarEntries);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < smallScreenSize;
      const selectedEntry = calendarEntries.find(
        (entry) => format(entry.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'),
      );

      if (isSmall && selectedEntry) {
        setFilteredEntries([selectedEntry]);
      } else {
        setFilteredEntries(calendarEntries);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calendarEntries]);

  return filteredEntries;
}

export default useResponsiveCalendarEntries;
