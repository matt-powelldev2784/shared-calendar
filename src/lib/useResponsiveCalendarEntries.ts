import type { CalendarEntriesData } from '@/ts/Calendar';
import { useEffect, useState, useRef } from 'react';

export function useResponsiveCalendarEntries(calendarEntries: CalendarEntriesData[]) {
  const [filteredEntries, setFilteredEntries] = useState(calendarEntries);
  const lastRan = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      const now = Date.now();
      if (now - lastRan.current > 300) {
        lastRan.current = now;
        const isSmall = window.innerWidth < 1023;
        setFilteredEntries(isSmall ? calendarEntries.slice(0, 1) : calendarEntries);
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
