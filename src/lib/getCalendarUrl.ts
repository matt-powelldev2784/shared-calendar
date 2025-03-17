import { format } from 'date-fns';

type getCalendarUrlProps = {
  calendarId: string;
  startDate?: string;
  daysToView?: number;
};

export const getCalendarUrl = ({
  calendarId,
  startDate,
  daysToView,
}: getCalendarUrlProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const url = `/get-calendar?calendarId=${calendarId}&startDate=${startDate || today}&daysToView=${daysToView || 7}`;
  return url;
};
