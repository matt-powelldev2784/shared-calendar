// Code to validate start and end dates
// this check that the dates are valid and that the start date is before the end date

import { isBefore, isEqual } from 'date-fns';

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
