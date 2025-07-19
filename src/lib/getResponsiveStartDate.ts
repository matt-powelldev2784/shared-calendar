import { format, startOfWeek } from 'date-fns';

export const getResponsiveStartDate = (isSmallScreen: boolean, date: Date) =>
  isSmallScreen ? format(date, 'yyyy-MM-dd') : format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
