export type CalendarEntry = {
  id: string;
  entryId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  calendarId: string;
  ownerIds: string[];
  subscribers: string[];
  pendingRequests: string[];
  finalTimeslotLength?: number; // length of the last timeslot in minutes
};

export type Calendar = {
  id: string;
  // the calendar id is a duplicate of the id field
  // this was required to get the firebase rules to work
  calendarId: string;
  name: string;
  description?: string;
  ownerIds?: string[];
  subscribers?: string[];
  pendingRequests?: string[];
  defaultCalendarId: string;
  color?: string;
};

export type Timeslot = {
  hour: number;
  entries: CalendarEntry[];
  numberOfEntries: number;
};

export type CalendarEntriesData = {
  date: Date;
  entries: Timeslot[];
};

export type Request = {
  id: string;
  ownerId: string;
  entryId: string;
  requestedUserIds: string[];
  requesterEmail: string;
  message: string;
};

export type UserDocument = {
  defaultCalendarId: string;
  displayName: string;
  email: string;
  subscribedCalendars: string[];
  userId: string;
};

export type TimeslotHeaders = {
  hour: number;
};
