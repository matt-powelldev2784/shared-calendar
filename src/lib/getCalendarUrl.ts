import { format } from 'date-fns';

type getCalendarUrlProps = {
  calendarIds: string;
  startDate?: string;
  daysToView?: number;
  startHour?: number;
  endHour?: number;
  uniqueRefreshString?: number;
};

export const getCalendarUrl = ({
  calendarIds,
  startDate,
  daysToView,
  startHour,
  endHour,
  uniqueRefreshString,
}: getCalendarUrlProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return (
    `/get-calendar?calendarIds=${calendarIds}` +
    `&startDate=${startDate || today}` +
    `&daysToView=${daysToView ?? 7}` +
    `&startHour=${startHour ?? 8}` +
    `&endHour=${endHour ?? 17}` +
    `&uniqueRefreshString=${uniqueRefreshString ?? Date.now()}`
  );
};
