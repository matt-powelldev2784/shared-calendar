import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import type { CalendarEntry } from "@/ts/Calendar";
import { CustomError } from "@/ts/errorClass";
import { isValidStartEndDates } from "@/lib/validateStartEndDates";

interface GetCalendarEntriesInput {
  calendarIds: string[];
  startDate: Date;
  endDate: Date;
}

const getCalendarEntries = async ({
  calendarIds,
  startDate,
  endDate,
}: GetCalendarEntriesInput) => {
  try {
    // validate text inputs
    if (!calendarIds || !calendarIds.length) {
      throw new CustomError(403, 'Calendar Ids are required');
    }

    // validate start and end dates
    if (!isValidStartEndDates(startDate, endDate)) {
      throw new CustomError(403, 'Invalid start and end dates');
    }

    // get a reference to the entries collection
    const entriesRef = collection(db, 'entries');

    // convert dates to firestore timestamps
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    // set up the query
    // get all entries that match the calendarIds and fall within the start and end dates
    const entriesQuery = query(
      entriesRef,
      where('calendarId', 'in', calendarIds),
      where('startDate', '>=', startTimestamp),
      where('endDate', '<=', endTimestamp),
    );
    const entriesQuerySnapshot = await getDocs(entriesQuery);

    // return an empty array if no entries are found
    if (entriesQuerySnapshot.empty) {
      console.log('No matching documents.');
      return [];
    }

    // map the documents to an array of calendar entries
    const calendarEntries = entriesQuerySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        calendarId: data.calendarId,
        ownerIds: data.ownerIds,
        subscribers: data.subscribers,
        pendingRequests: data.pendingRequests,
      } as CalendarEntry;
    });

    return calendarEntries;
  } catch (error) {
    console.error("Error getting calendar entries: ", error);
    throw new CustomError(500, "Failed to get calendar entries");
  }
};

export default getCalendarEntries;
