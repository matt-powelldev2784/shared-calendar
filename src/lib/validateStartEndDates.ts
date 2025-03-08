import { isBefore, isEqual } from "date-fns";

export const isValidStartEndDates = (
  startDate: Date,
  endDate: Date,
): boolean => {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    return false;
  }

  if (isEqual(startDate, endDate)) {
    return true;
  }

  return isBefore(startDate, endDate);
};
