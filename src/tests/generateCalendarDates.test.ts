import { generateCalendarDates } from '@/lib/generateCalendarData';
import { describe, expect, test } from 'vitest';

describe('generateCalendarDates', () => {
  test('returns an array where the length matches the daysToReturn input', () => {
    const calendarDates = generateCalendarDates({
      daysToReturn: 7,
      firstDateToDisplay: new Date('Jan 01 2025'),
    });
    expect(calendarDates).toHaveLength(7);
  });

  test('returns an array of dates', () => {
    const calendarDates = generateCalendarDates({
      daysToReturn: 7,
      firstDateToDisplay: new Date('Jan 01 2025'),
    });
    calendarDates.forEach((date) => {
      expect(date).toBeInstanceOf(Date);
    });
  });
});
