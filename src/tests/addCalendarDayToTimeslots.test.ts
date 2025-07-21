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

    const midnightSlot = timeslots.find((slot) => slot.hour === 0);
    const onePmSlot = timeslots.find((slot) => slot.hour === 13);
    const nineAmSlot = timeslots.find((slot) => slot.hour === 9);

    expect(timeslots).toHaveLength(24);
    expect(midnightSlot?.entries).toHaveLength(1);
    expect(onePmSlot?.entries).toHaveLength(1);
    expect(nineAmSlot?.entries).toHaveLength(0);
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

    const tenAmEntry = timeslots.find((slot) => slot.hour === 10);
    const elevenEntry = timeslots.find((slot) => slot.hour === 11);
    const middayEntry = timeslots.find((slot) => slot.hour === 12);

    expect(tenAmEntry?.entries).toHaveLength(1);
    expect(elevenEntry?.entries).toHaveLength(1);
    expect(middayEntry?.entries).toHaveLength(1);
  });

  test('should handle entries that start before the startHour and end after the endHour', () => {
    const calendarData = [
      {
        id: '1',
        entryId: '1',
        title: 'Test Event With Extended Hours',
        startDate: new Date('2025-01-01T00:00:00'),
        endDate: new Date('2025-01-01T23:59:59'),
        calendarId: 'calendar1',
        ownerIds: ['user1'],
        subscribers: [],
        pendingRequests: [],
      },
    ];

    const date = new Date('2025-01-01');
    const startHour = 8;
    const endHour = 17;

    const timeslots = addCalendarDayToTimeslots({
      calendarData,
      date,
      startHour,
      endHour,
    });

    const eightAmEntry = timeslots.find((slot) => slot.hour === 8);
    const fivePmEntry = timeslots.find((slot) => slot.hour === 17);

    expect(timeslots).toHaveLength(10);
    expect(eightAmEntry?.entries).toHaveLength(1);
    expect(fivePmEntry?.entries).toHaveLength(1);
  });

  test('should return empty timeslots when no entries match the date', () => {
    const calendarData = [
      {
        id: '1',
        entryId: '1',
        title: 'Test Event',
        startDate: new Date('2025-01-02T00:00:00'),
        endDate: new Date('2025-01-02T01:00:00'),
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

    expect(timeslots).toHaveLength(24);
    timeslots.forEach((slot) => {
      expect(slot.entries).toHaveLength(0);
    });
  });

  test('should handle entries that start at midnight and are not a full hour long', () => {
    const calendarData = [
      {
        id: '1',
        entryId: '1',
        title: 'Midnight Event',
        startDate: new Date('2025-01-01T00:00:00'),
        endDate: new Date('2025-01-01T00:30:00'),
        calendarId: 'calendar1',
        ownerIds: ['user1'],
        subscribers: [],
        pendingRequests: [],
      },
      {
        id: '2',
        entryId: '2',
        title: 'Afternoon Event',
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

    const midnightSlot = timeslots.find((slot) => slot.hour === 0);
    const onePmSlot = timeslots.find((slot) => slot.hour === 13);
    const nineAmSlot = timeslots.find((slot) => slot.hour === 9);
    expect(timeslots).toHaveLength(24);
    expect(midnightSlot?.entries).toHaveLength(1);
    expect(onePmSlot?.entries).toHaveLength(1);
    expect(nineAmSlot?.entries).toHaveLength(0);
  });

  test('should handle entries that end at midnight', () => {
    const calendarData = [
      {
        id: '1',
        entryId: '1',
        title: 'Midnight End Event',
        startDate: new Date('2025-01-01T23:00:00'),
        endDate: new Date('2025-01-01T23:59:00'),
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

    const elevenPmSlot = timeslots.find((slot) => slot.hour === 23);
    expect(timeslots).toHaveLength(24);
    expect(elevenPmSlot?.entries).toHaveLength(1);
  });

});




