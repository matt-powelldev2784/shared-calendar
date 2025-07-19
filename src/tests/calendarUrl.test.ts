import { describe, expect, test } from 'vitest';
import { format } from 'date-fns';
import { getCalendarUrl } from '@/lib/getCalendarUrl';

describe('getCalendarUrl', () => {
  test('returns a URL with all parameters provided', () => {
    const url = getCalendarUrl({
      calendarIds: 'abcdefgh',
      startDate: '2025-07-20',
      daysToView: 3,
      startHour: 9,
      endHour: 18,
    });
    expect(url).toBe('/get-calendar?calendarIds=abcdefgh&startDate=2025-07-20&daysToView=3&startHour=9&endHour=18');
  });

  test('uses today as default startDate if not provided', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const url = getCalendarUrl({
      calendarIds: 'abcdefgh',
      daysToView: 5,
      startHour: 10,
      endHour: 20,
    });
    expect(url).toBe(`/get-calendar?calendarIds=abcdefgh&startDate=${today}&daysToView=5&startHour=10&endHour=20`);
  });

  test('uses default daysToView, startHour, and endHour if not provided', () => {
    const url = getCalendarUrl({
      calendarIds: 'abcdefgh',
      startDate: '2025-01-01',
    });
    expect(url).toBe('/get-calendar?calendarIds=abcdefgh&startDate=2025-01-01&daysToView=7&startHour=8&endHour=17');
  });

  test('uses all defaults if only calendarIds is provided', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const url = getCalendarUrl({
      calendarIds: 'abcdefgh',
    });
    expect(url).toBe(`/get-calendar?calendarIds=abcdefgh&startDate=${today}&daysToView=7&startHour=8&endHour=17`);
  });
});
