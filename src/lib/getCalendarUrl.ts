import { format } from 'date-fns';

type getCalendarUrlProps = {
  calendarIds: string;
  startDate?: string;
  daysToView?: number;
};

export const getCalendarUrl = ({
  calendarIds,
  startDate,
  daysToView,
}: getCalendarUrlProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const url = `/get-calendar?calendarIds=${calendarIds}&startDate=${startDate || today}&daysToView=${daysToView || 7}`;
  return url;
};
