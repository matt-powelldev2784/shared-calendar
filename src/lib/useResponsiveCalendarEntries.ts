import type { CalendarEntriesData } from '@/ts/Calendar';
import { useEffect, useState } from 'react';

export function useResponsiveCalendarEntries(calendarEntries: CalendarEntriesData[]) {
  const [filteredEntries, setFilteredEntries] = useState(calendarEntries);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const isSmall = window.innerWidth < 1023;
        setFilteredEntries(isSmall ? calendarEntries.slice(0, 1) : calendarEntries);
      }, 150);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [calendarEntries]);

  return filteredEntries;
}

export default useResponsiveCalendarEntries;
