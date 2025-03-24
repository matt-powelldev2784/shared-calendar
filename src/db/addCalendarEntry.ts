import {
  collection,
  doc,
  getDoc,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import { CustomError } from '@/ts/errorClass';
import checkAuth from './checkAuth';
import { hasDuplicates } from '@/lib/hasDuplicates';
import { isValidStartEndDates } from '@/lib/validateStartEndDates';

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

    // validate data
    if (!entry.title || !entry.calendarId) {
      throw new CustomError(403, 'Title and calendar Id is required');
    }

    // validate start and end dates
    if (!isValidStartEndDates(entry.startDate, entry.endDate)) {
      throw new CustomError(403, 'Invalid start and end dates');
    }

    // get entry subscribers from calendar subscribers
    const calendarDocRef = doc(db, 'calendars', entry.calendarId);
    const calendarDoc = await getDoc(calendarDocRef);
    if (!calendarDoc.exists()) {
      throw new CustomError(404, 'Error adding entry, calendar does not exist');
    }

    const calendarDocData = calendarDoc.data();
    const calendarSubscribers = calendarDocData?.subscribers || [];

    // define entry data
    const ownerIds = entry.ownerIds
      ? entry.ownerIds.concat(currentUser.uid)
      : [currentUser.uid];
    const subscribers = calendarSubscribers;
    const pendingRequests = entry.pendingRequests || [];

    // validate arrays for uniqueness
    if (hasDuplicates(ownerIds)) {
      throw new CustomError(403, 'Owner IDs must be unique');
    }
    if (hasDuplicates(subscribers)) {
      throw new CustomError(403, 'Subscriber IDs must be unique');
    }
    if (hasDuplicates(pendingRequests)) {
      throw new CustomError(403, 'Pending requests userIds must be unique');
    }

    const entryDocRef = await runTransaction(db, async (transaction) => {
      // add calendar entry
      const entriesRef = collection(db, 'entries');
      const newEntry = {
        ...entry,
        startDate: Timestamp.fromDate(entry.startDate),
        endDate: Timestamp.fromDate(entry.endDate),
        ownerIds,
        subscribers,
        pendingRequests,
      };
      const entryDocRef = doc(entriesRef);
      transaction.set(entryDocRef, { ...newEntry, entryId: entryDocRef.id });

      // add request to requests collection
      if (pendingRequests.length > 0) {
        const requestsRef = collection(db, 'requests');
        const newRequest = {
          userId: currentUser.uid,
          entryId: entryDocRef.id,
          requesterEmail: currentUser.email,
          requestedUserIds: pendingRequests,
        };
        const requestDocRef = doc(requestsRef);
        transaction.set(requestDocRef, {
          ...newRequest,
          requestId: requestDocRef.id,
        });
      }

      return entryDocRef;
    });

    if (!entryDocRef) {
      throw new CustomError(403, 'Error adding entry, transaction failed');
    }
    return entryDocRef.id;
  } catch (error) {
    console.error('Error adding calendar entry: ', error);
    throw error;
  }
};

export default addCalendarEntry;
