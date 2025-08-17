import { format } from 'date-fns';

type getCalendarUrlProps = {
  calendarIds: string;
  startDate?: string;
  daysToView?: number;
  startHour?: number;
  endHour?: number;
  selectedDate: string;
  uniqueRefreshString?: number;
};

export const getCalendarUrl = ({
  calendarIds,
  startDate,
  daysToView,
  startHour,
  endHour,
  selectedDate,
  uniqueRefreshString,
}: getCalendarUrlProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return (
    `/get-calendar?calendarIds=${calendarIds}` +
    `&startDate=${startDate || today}` +
    `&daysToView=${daysToView ?? 7}` +
    `&startHour=${startHour ?? 8}` +
    `&endHour=${endHour ?? 17}` +
    `&selectedDate=${selectedDate || today}` +
    `&uniqueRefreshString=${uniqueRefreshString ?? Date.now()}`
  );
};
