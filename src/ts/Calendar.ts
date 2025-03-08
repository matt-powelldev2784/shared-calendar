export type CalendarEntry = {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  calendarId: string;
  ownerIds: string[];
  subscribers: string[];
  pendingRequests: string[];
};

