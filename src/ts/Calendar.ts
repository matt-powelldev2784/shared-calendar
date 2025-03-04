export type CalendarEntry = {
  id: string;
  title: string;
  description?: string;
  dateTime: Date;
  calendarId: string;
  ownerIds: string[];
  subscribers: string[];
  pendingRequests: string[];
};

