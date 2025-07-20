import type { CalendarEntriesData } from '@/ts/Calendar';
import { useEffect, useState } from 'react';

export function useResponsiveCalendarEntries(calendarEntries: CalendarEntriesData[]) {
  const [filteredEntries, setFilteredEntries] = useState(calendarEntries);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 1023;
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
