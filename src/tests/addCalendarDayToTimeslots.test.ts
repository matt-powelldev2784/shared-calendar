import { addCalendarDayToTimeslots } from '@/lib/generateCalendarData';
import { describe, expect, test } from 'vitest';

describe('addCalendarDayToTimeslots', () => {
  test('should return an array of timeslots with the correct number of entries', () => {
    const calendarData = [
      {
        id: '1',
        entryId: '1',
        title: 'Test Event',
        startDate: new Date('2025-01-01T00:00:00'),
        endDate: new Date('2025-01-01T01:00:00'),
        calendarId: 'calendar1',
        ownerIds: ['user1'],
        subscribers: [],
        pendingRequests: [],
      },
      {
        id: '2',
        entryId: '2',
        title: 'Test Event 2',
        startDate: new Date('2025-01-01T13:00:00'),
        endDate: new Date('2025-01-01T13:30:00'),
        calendarId: 'calendar1',
        ownerIds: ['user1'],
        subscribers: [],
        pendingRequests: [],
      },
    ];

    const date = new Date('2025-01-01');
    const startHour = 0;
    const endHour = 23;

    const timeslots = addCalendarDayToTimeslots({
      calendarData,
      date,
      startHour,
      endHour,
    });

    expect(timeslots).toHaveLength(24); // 24 hours in a day
    expect(timeslots[0].entries).toHaveLength(1); // 0:00 midnight slot has one entry
    expect(timeslots[13].entries).toHaveLength(1); // 13:00 slot has one entry
    expect(timeslots[8].entries).toHaveLength(0); // 09:00 slot has no entries
  });

  test('should handle entries that span multiple hours and start in the middle of the first hour', () => {
    const calendarData = [
      {
        id: '1',
        entryId: '1',
        title: 'Test Event',
        startDate: new Date('2025-01-01T00:00:00'),
        endDate: new Date('2025-01-01T01:00:00'),
        calendarId: 'calendar1',
        ownerIds: ['user1'],
        subscribers: [],
        pendingRequests: [],
      },
      {
        id: '2',
        entryId: '2',
        title: 'Test Event 2',
        startDate: new Date('2025-01-01T13:00:00'),
        endDate: new Date('2025-01-01T13:30:00'),
        calendarId: 'calendar1',
        ownerIds: ['user1'],
        subscribers: [],
        pendingRequests: [],
      },
      {
        id: '3',
        entryId: '3',
        title: 'Entry Spanning Multiple Hours',
        startDate: new Date('2025-01-01T10:30:00'),
        endDate: new Date('2025-01-01T12:30:00'),
        calendarId: 'calendar1',
        ownerIds: ['user1'],
        subscribers: [],
        pendingRequests: [],
      },
    ];

    const date = new Date('2025-01-01');
    const startHour = 0;
    const endHour = 23;

    // Add an entry that spans multiple hours
    calendarData.push();

    const timeslots = addCalendarDayToTimeslots({
      calendarData,
      date,
      startHour,
      endHour,
    });

    expect(timeslots[10].entries).toHaveLength(1); // 10:00 slot has one entry
    expect(timeslots[11].entries).toHaveLength(1); // 11:00 slot has one entry
    expect(timeslots[12].entries).toHaveLength(1); // 12:00 slot has no entries
  });
});
