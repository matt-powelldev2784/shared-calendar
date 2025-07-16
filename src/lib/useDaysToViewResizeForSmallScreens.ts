import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { getCalendarUrl } from './getCalendarUrl';

export const useDaysToViewResizeForSmallScreens = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const search = useSearch({ from: '/get-calendar' });
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        const isSmallScreen = window.innerWidth <= 1023;
        const isOnGetCalendar = location.pathname === '/get-calendar';

        // Only navigate if not already daysToView=1
        if (isOnGetCalendar && isSmallScreen && search.daysToView !== 1) {
          const url = getCalendarUrl({
            calendarIds: search.calendarIds,
            startDate: search.startDate,
            daysToView: 1,
            startHour: search.startHour,
            endHour: search.endHour,
          });
          navigate({ to: url, replace: true });
        }
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    // Run on mount in case already small
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    location.pathname,
    navigate,
    search.calendarIds,
    search.startDate,
    search.daysToView,
    search.startHour,
    search.endHour,
  ]);
};
