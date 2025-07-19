import type { CalendarEntry, TimeslotHeaders } from '@/ts/Calendar';
import { addDays, addMinutes, differenceInMinutes, format } from 'date-fns';

type GetDatesToDisplay = {
  daysToReturn: number;
  calendarData: CalendarEntry[];
  firstDateToDisplay: Date;
  startHour: number;
  endHour: number;
};

const generateCalendarData = ({
  daysToReturn,
  calendarData,
  firstDateToDisplay,
  startHour,
  endHour,
}: GetDatesToDisplay) => {
  // initialize array where the length is the number of days to return
  const initializeDaysToReturn = Array.from(
    { length: daysToReturn },
    () => undefined,
  );

  // map the dates of the days to display
  const dateTitles: Date[] =
    initializeDaysToReturn.reduce((accumulator, _, index) => {
      if (index === 0) return [...accumulator, firstDateToDisplay];
      return [...accumulator, addDays(firstDateToDisplay, index)];
    }, [] as Date[]) || [];

  // merge the calendar entires with the days and hours to display
  // this returns an array of days
  // each day is split into 24 hours
  // each hour has an array of calendar entries for that hour
  const calendarEntries = dateTitles.map((date, index) => {
    // create an array of 24 objects, one for each hour of the day
    const hoursToDisplay = endHour - startHour + 1;
    const entiresByHour = Array.from({ length: hoursToDisplay }).map((_, i) => ({
      hour: startHour + i,
      entries: [] as CalendarEntry[],
      numberOfEntries: 0,
    }));

    // filter the calendar data for the current date
    // sort by date and time
    // add the entries for each hour to the entriesByHour array
    // if the entry is longer than 60 minutes, add it to the next timeslots as required
    calendarData
      .filter((entry) => format(date, 'd') === format(entry.startDate, 'd'))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .forEach((entry) => {
        const hour = new Date(entry.startDate).getHours();
        const hourIndex = hour - startHour;
        const entryLength = differenceInMinutes(entry.endDate, entry.startDate);
        const numberOfHourTimeslots = Math.ceil(entryLength / 60);

        // add the timeslot length in minutes to the entry
        // this is used to calculate the height of the calendar card
        Array.from({ length: numberOfHourTimeslots }).forEach((_, i) => {
          const nextHourIndex = hourIndex + i;

          // if the entry is for the last timeslot, calculate the final timeslot length
          // and add the entry to relevant hour
          if (numberOfHourTimeslots === i + 1) {
            const timeslotLength = differenceInMinutes(entry.endDate, addMinutes(entry.startDate, i * 60));
            const entryWithFinishedTime = {
              ...entry,
              timeslotLength,
            };
            entiresByHour[nextHourIndex].entries.push(entryWithFinishedTime);
          } else {
            // if the entry is not for the last timeslot, set the timeslot length to 60 minutes
            // every timeslot will be 60 minutes except the last one
            // this is used to generate entries that span over multiple hours
            const entryWithFinishedTime = {
              ...entry,
              timeslotLength: 60,
            };
            entiresByHour[nextHourIndex].entries.push(entryWithFinishedTime);
          }
        });
      });

    // add the number of entries for each hour to the entriesByHour array
    entiresByHour.forEach((hourTimeSlot) => {
      hourTimeSlot.numberOfEntries = hourTimeSlot.entries.length;
    });

    // populate the entries for each day
    const day = { date: dateTitles[index], entries: [...entiresByHour] };

    return day;
  });

  // generate the timeslot headers based on the start and end hour
  const timeslotHeaders = generateTimeslotHeaders(startHour, endHour);

  return { calendarEntries, timeslotHeaders };
};

export default generateCalendarData;

const generateTimeslotHeaders = (
  startHour: number,
  endHour: number,
): TimeslotHeaders[] => {
  const hoursToDisplay = endHour - startHour + 1;
  const timeslots = Array.from({ length: hoursToDisplay }).map((_, i) => ({
    hour: startHour + i,
  }));

  return timeslots;
};
