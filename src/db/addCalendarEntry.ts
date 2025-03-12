import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from '@/db/firebaseConfig';
import { CustomError } from "@/ts/errorClass";
import checkAuth from "./checkAuth";
import { hasDuplicates } from "@/lib/hasDuplicates";
import { isValidStartEndDates } from "@/lib/validateStartEndDates";

export type AddCalendarEntry = {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  calendarId: string;
  ownerIds?: string[];
  subscribers?: string[];
  pendingRequests?: string[];
};

const addCalendarEntry = async (entry: AddCalendarEntry) => {
  try {
    const currentUser = await checkAuth();

    const ownerIds = entry.ownerIds
      ? entry.ownerIds.concat(currentUser.uid)
      : [currentUser.uid];
    const subscribers = entry.subscribers || [];
    const pendingRequests = entry.pendingRequests || [];

    // validate data
    if (!entry.title || !entry.calendarId) {
      throw new CustomError(403, "Title and calendar Id is required");
    }

    // // validate start and end dates
    if (!isValidStartEndDates(entry.startDate, entry.endDate)) {
      throw new CustomError(403, "Invalid start and end dates");
    }

    // validate arrays for uniqueness
    if (hasDuplicates(ownerIds)) {
      throw new CustomError(403, "Owner IDs must be unique");
    }
    if (hasDuplicates(subscribers)) {
      throw new CustomError(403, "Subscriber IDs must be unique");
    }
    if (hasDuplicates(pendingRequests)) {
      throw new CustomError(403, "Pending Requests must be unique");
    }

    // add calendar entry
    const entriesRef = collection(db, "entries");
    const newEntry = {
      ...entry,
      startDate: Timestamp.fromDate(entry.startDate),
      endDate: Timestamp.fromDate(entry.endDate),
      ownerIds,
      subscribers,
      pendingRequests,
    };
    const entryDocRef = await addDoc(entriesRef, newEntry);
    return entryDocRef.id;
  } catch (error) {
    console.error("Error adding calendar entry: ", error);
    throw error;
  }
};

export default addCalendarEntry;
