import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { CustomError } from "@/ts/errorClass";
import checkAuth from "./checkAuth";
import { hasDuplicates } from "@/lib/hasDuplicates";
import type { CalendarEntryInput } from "../ts/Calendar";

const addCalendarEntry = async (entry: CalendarEntryInput) => {
  try {
    const currentUser = checkAuth();

    const ownerIds = entry.ownerIds
      ? entry.ownerIds.concat(currentUser.uid)
      : [currentUser.uid];
    const subscribers = entry.subscribers || [];
    const pendingRequests = entry.pendingRequests || [];

    // validate for uniqueness
    if (hasDuplicates(ownerIds)) {
      throw new CustomError(400, "Owner IDs must be unique");
    }
    if (hasDuplicates(subscribers)) {
      throw new CustomError(400, "Subscriber IDs must be unique");
    }
    if (hasDuplicates(pendingRequests)) {
      throw new CustomError(400, "Pending Requests must be unique");
    }

    // add calendar entry
    const entriesRef = collection(db, "entries");
    const newEntry = {
      ...entry,
      dateTime: Timestamp.fromDate(entry.dateTime),
      ownerIds,
      subscribers,
      pendingRequests,
    };
    const entryDocRef = await addDoc(entriesRef, newEntry);
    return entryDocRef.id;
  } catch (error) {
    console.error("Error adding calendar entry: ", error);
    throw new CustomError(500, "Failed to add calendar entry");
  }
};

export default addCalendarEntry;
