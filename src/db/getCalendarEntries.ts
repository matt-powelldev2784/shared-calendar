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
    const entriesRef = collection(db, "entries");
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const entriesQuery = query(
      entriesRef,
      where("calendarId", "in", calendarIds),
      where("dateTime", ">=", startTimestamp),
      where("dateTime", "<=", endTimestamp),
    );

    const entriesQuerySnapshot = await getDocs(entriesQuery);

    if (entriesQuerySnapshot.empty) {
      console.log("No matching documents.");
      return [];
    }

    const calendarEntries = entriesQuerySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        dateTime: data.dateTime.toDate(),
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
