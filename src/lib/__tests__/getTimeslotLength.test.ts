import { getTimeslotLength } from '@/lib/generateCalendarData';
import { describe, expect, test } from 'vitest';

describe('getTimeslotLength', () => {
  test('should return the correct length for a single timeslot', () => {
    const startDate = new Date('2025-01-01T00:00:00');
    const endDate = new Date('2025-01-01T00:30:00');
    const result = getTimeslotLength({
      isFirstTimeslot: true,
      isLastTimeslot: true,
      startDate,
      endDate,
    });
    expect(result).toBe(30);
  });
  test('should return the correct length for the first timeslot in a multi hour entry', () => {
    const startDate = new Date('2025-01-01T00:00:00');
    const endDate = new Date('2025-01-01T01:30:00');
    const result = getTimeslotLength({
      isFirstTimeslot: true,
      isLastTimeslot: false,
      startDate,
      endDate,
    });
    expect(result).toBe(60);
  });

  test('should return the correct length for the last timeslot in a multi hour entry', () => {
    const startDate = new Date('2025-01-01T00:00:00');
    const endDate = new Date('2025-01-01T01:30:00');
    const result = getTimeslotLength({
      isFirstTimeslot: false,
      isLastTimeslot: true,
      startDate,
      endDate,
    });
    expect(result).toBe(30);
  });

  test('should return the correct length for a middle timeslot in a multi hour entry', () => {
    const startDate = new Date('2025-01-01T00:30:00');
    const endDate = new Date('2025-01-01T01:30:00');
    const result = getTimeslotLength({
      isFirstTimeslot: false,
      isLastTimeslot: false,
      startDate,
      endDate,
    });
    expect(result).toBe(60);
  });

  test('should handle a single timeslot that spans less than an hour', () => {
    const startDate = new Date('2025-01-01T00:00:00');
    const endDate = new Date('2025-01-01T00:45:00');
    const result = getTimeslotLength({
      isFirstTimeslot: true,
      isLastTimeslot: true,
      startDate,
      endDate,
    });
    expect(result).toBe(45);
  });
});
