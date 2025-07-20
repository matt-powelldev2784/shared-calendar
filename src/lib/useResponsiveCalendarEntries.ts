import type { CalendarEntriesData } from '@/ts/Calendar';
import { useEffect, useState } from 'react';
import { smallScreenSize } from './smallScreenSize';

export function useResponsiveCalendarEntries(calendarEntries: CalendarEntriesData[]) {
  const [filteredEntries, setFilteredEntries] = useState(calendarEntries);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < smallScreenSize;
      setFilteredEntries(isSmall ? calendarEntries.slice(0, 1) : calendarEntries);
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
