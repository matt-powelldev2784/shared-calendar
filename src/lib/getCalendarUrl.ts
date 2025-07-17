import { format } from 'date-fns';

type getCalendarUrlProps = {
  calendarIds: string;
  startDate?: string;
  daysToView?: number;
  startHour?: number;
  endHour?: number;
};

export const getCalendarUrl = ({
  calendarIds,
  startDate,
  daysToView,
  startHour,
  endHour,
}: getCalendarUrlProps) => {
  const parsedStartHour = startHour === 0 ? '0' : startHour;
  const today = format(new Date(), 'yyyy-MM-dd');
  const url = `/get-calendar?calendarIds=${calendarIds}&startDate=${startDate || today}&daysToView=${daysToView || 7}&startHour=${parsedStartHour || 8}&endHour=${endHour || 18}`;
  return url;
};
