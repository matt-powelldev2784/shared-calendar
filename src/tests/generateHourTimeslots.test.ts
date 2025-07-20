import { getHourTimeslots } from '@/lib/generateCalendarData';
import { describe, expect, test } from 'vitest';

describe('generateHourTimeslots', () => {
  test('Returns an array containing one timeslot for each hour between 08:00 and 17:00 inclusive, a total of 10 timeslots.', () => {
    const hourTimeslots = getHourTimeslots({ startHour: 8, endHour: 17 });
    expect(hourTimeslots).toHaveLength(10); // 8:00 to 17:00 inclusive
  });

  test('Returns an array containing one timeslot for all 24 hours in a days, a total of 24 timeslots.', () => {
    const hourTimeslots = getHourTimeslots({ startHour: 0, endHour: 23 });
    expect(hourTimeslots).toHaveLength(24); // 8:00 to 17:00 inclusive
  });

  test('returns an array with the correct properties for each timeslot', () => {
    const hourTimeslots = getHourTimeslots({ startHour: 8, endHour: 17 });
    hourTimeslots.forEach((timeslot) => {
      expect(timeslot).toHaveProperty('hour');
      expect(timeslot).toHaveProperty('entries');
      expect(Array.isArray(timeslot.entries)).toBe(true); // Initially, no entries are added
      expect(typeof timeslot.hour).toBe('number');
    });
  });
});
