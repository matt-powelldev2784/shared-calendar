import { describe, expect, test } from 'vitest';
import { getCalendarUrl } from '@/lib/getCalendarUrl';

describe('getCalendarUrl', () => {
  test('returns a URL with all parameters provided', () => {
    const url = getCalendarUrl({
      calendarIds: 'abcdefgh',
      daysToView: 3,
      startHour: 9,
      endHour: 18,
      selectedDate: '2025-01-12',
      uniqueRefreshString: 1234567890,
    });
    expect(url).toBe(
      '/get-calendar?calendarIds=abcdefgh&startDate=2025-01-06&daysToView=3&startHour=9&endHour=18&selectedDate=2025-01-12&uniqueRefreshString=1234567890',
    );
  });

  test('uses default daysToView, startHour, and endHour if not provided', () => {
    const url = getCalendarUrl({
      calendarIds: 'abcdefgh',
      uniqueRefreshString: 555555555,
      selectedDate: '2025-01-12',
    });
    expect(url).toBe(
      '/get-calendar?calendarIds=abcdefgh&startDate=2025-01-06&daysToView=7&startHour=8&endHour=17&selectedDate=2025-01-12&uniqueRefreshString=555555555',
    );
  });

  test('calculates startDate correctly when crossing month boundary', () => {
    const url = getCalendarUrl({
      calendarIds: 'abcdefgh',
      uniqueRefreshString: 444444444,
      selectedDate: '2025-02-02',
    });
    expect(url).toBe(
      '/get-calendar?calendarIds=abcdefgh&startDate=2025-01-27&daysToView=7&startHour=8&endHour=17&selectedDate=2025-02-02&uniqueRefreshString=444444444',
    );
  });

  test('calculates startDate correctly when crossing year boundary', () => {
    const url = getCalendarUrl({
      calendarIds: 'abcdefgh',
      uniqueRefreshString: 555555555,
      selectedDate: '2025-01-05',
    });
    expect(url).toBe(
      '/get-calendar?calendarIds=abcdefgh&startDate=2024-12-30&daysToView=7&startHour=8&endHour=17&selectedDate=2025-01-05&uniqueRefreshString=555555555',
    );
  });
});
