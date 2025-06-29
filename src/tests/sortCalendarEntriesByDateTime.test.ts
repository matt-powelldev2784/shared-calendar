import sortCalendarEntriesByDateTime from '@/lib/sortCalendarEntriesByDateTime';
import type { CalendarEntry } from '@/ts/Calendar';
import { describe, expect, test } from 'vitest';

describe('sortCalendarEntriesByDateTime', () => {
  test('should group and sort entries by date and time', () => {
    const firstDate = new Date('2024-06-29T00:00:00Z');
    const calendarData: CalendarEntry[] = [
      {
        id: '1',
        entryId: '1',
        title: 'Morning Meeting',
        description: 'Daily standup',
        startDate: new Date('2024-06-29T09:00:00Z'),
        endDate: new Date('2024-06-29T10:00:00Z'),
        calendarId: 'cal-1',
        ownerIds: ['owner1'],
        subscribers: ['user1', 'user2'],
        pendingRequests: [],
      },
      {
        id: '2',
        entryId: '2',
        title: 'Lunch',
        description: 'Team lunch',
        startDate: new Date('2024-06-29T13:00:00Z'),
        endDate: new Date('2024-06-29T14:00:00Z'),
        calendarId: 'cal-1',
        ownerIds: ['owner1'],
        subscribers: ['user1', 'user2'],
        pendingRequests: ['user3'],
      },
      {
        id: '3',
        entryId: '3',
        title: 'Next Day Meeting',
        description: 'Planning session',
        startDate: new Date('2024-06-30T09:00:00Z'),
        endDate: new Date('2024-06-30T10:00:00Z'),
        calendarId: 'cal-2',
        ownerIds: ['owner2'],
        subscribers: ['user4'],
        pendingRequests: [],
      },
    ];

    const result = sortCalendarEntriesByDateTime({
      daysToReturn: 2,
      calendarData,
      firstDateToDisplay: firstDate,
    });

    expect(result).toEqual([
      {
        date: firstDate,
        entries: [
          {
            id: '1',
            entryId: '1',
            title: 'Morning Meeting',
            description: 'Daily standup',
            startDate: new Date('2024-06-29T09:00:00Z'),
            endDate: new Date('2024-06-29T10:00:00Z'),
            calendarId: 'cal-1',
            ownerIds: ['owner1'],
            subscribers: ['user1', 'user2'],
            pendingRequests: [],
          },
          {
            id: '2',
            entryId: '2',
            title: 'Lunch',
            description: 'Team lunch',
            startDate: new Date('2024-06-29T13:00:00Z'),
            endDate: new Date('2024-06-29T14:00:00Z'),
            calendarId: 'cal-1',
            ownerIds: ['owner1'],
            subscribers: ['user1', 'user2'],
            pendingRequests: ['user3'],
          },
        ],
      },
      {
        date: new Date('2024-06-30T00:00:00Z'),
        entries: [
          {
            id: '3',
            entryId: '3',
            title: 'Next Day Meeting',
            description: 'Planning session',
            startDate: new Date('2024-06-30T09:00:00Z'),
            endDate: new Date('2024-06-30T10:00:00Z'),
            calendarId: 'cal-2',
            ownerIds: ['owner2'],
            subscribers: ['user4'],
            pendingRequests: [],
          },
        ],
      },
    ]);
  });

  test('should return empty entries for days with no events', () => {
    const firstDate = new Date('2024-06-29T00:00:00Z');
    const calendarData: CalendarEntry[] = [];

    const result = sortCalendarEntriesByDateTime({
      daysToReturn: 7,
      calendarData,
      firstDateToDisplay: firstDate,
    });

    expect(result).toEqual([
      { date: new Date('2024-06-29T00:00:00Z'), entries: [] },
      { date: new Date('2024-06-30T00:00:00Z'), entries: [] },
      { date: new Date('2024-07-01T00:00:00Z'), entries: [] },
      { date: new Date('2024-07-02T00:00:00Z'), entries: [] },
      { date: new Date('2024-07-03T00:00:00Z'), entries: [] },
      { date: new Date('2024-07-04T00:00:00Z'), entries: [] },
      { date: new Date('2024-07-05T00:00:00Z'), entries: [] },
    ]);
  });
});
