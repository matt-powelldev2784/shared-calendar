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
    // each object will have an hour and an array of entries for that hour
    const hoursToDisplay = endHour - startHour + 1;
    const entiresByHour = Array.from({ length: hoursToDisplay }).map(
      (_, i) => ({
        hour: startHour + i,
        entries: [] as CalendarEntry[],
        numberOfEntries: 0,
      }),
    );

    // filter the calendar data for the current date
    // sort by date and time
    // add the entries for each hour to the entriesByHour array
    // if the entry is longer than 60 minutes, add it to the next timeslots as required
    calendarData
      .filter((entry) => format(date, 'd') === format(entry.startDate, 'd'))
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )
      .forEach((entry) => {
        const hour = new Date(entry.startDate).getHours();
        const hourIndex = hour - startHour;
        const entryLength = differenceInMinutes(entry.endDate, entry.startDate);
        const numberOfHourTimeslots = Math.ceil(entryLength / 60);

        Array.from({ length: numberOfHourTimeslots }).forEach((_, i) => {
          if (i === 0) {
            // add the first hour entry
            entiresByHour[hourIndex].entries.push(entry);
            return;
          }

          // set the final timeslot length for the last hour
          // this is used to calculate the height of the card in the calendar view
          const nextHourIndex = hourIndex + i;

          // if the entry is for the last timeslot, set the final timeslot length
          // and add the entry to relevant hour
          if (i === numberOfHourTimeslots - 1) {
            const finalTimeslotLength = differenceInMinutes(
              entry.endDate,
              addMinutes(entry.startDate, i * 60),
            );
            const entryWithFinishedTime = {
              ...entry,
              finalTimeslotLength,
            };
            entiresByHour[nextHourIndex].entries.push(entryWithFinishedTime);
            return;
          }

          // if this is not for the last hour, just add the entry to the correct timeslot
          if (nextHourIndex < entiresByHour.length) {
            entiresByHour[nextHourIndex].entries.push(entry);
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
