import { format, startOfWeek } from 'date-fns';

type getCalendarUrlProps = {
  calendarIds: string;
  daysToView?: number;
  startHour?: number;
  endHour?: number;
  selectedDate: string;
  uniqueRefreshString?: number;
};

export const getCalendarUrl = ({
  calendarIds,
  daysToView,
  startHour,
  endHour,
  selectedDate,
  uniqueRefreshString,
}: getCalendarUrlProps) => {
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');

  return (
    `/get-calendar?calendarIds=${calendarIds}` +
    `&startDate=${formattedStartDate}` +
    `&daysToView=${daysToView ?? 7}` +
    `&startHour=${startHour ?? 8}` +
    `&endHour=${endHour ?? 17}` +
    `&selectedDate=${selectedDate}` +
    `&uniqueRefreshString=${uniqueRefreshString ?? Date.now()}`
  );
};
