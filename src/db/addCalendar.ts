import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import { CustomError } from '@/ts/errorClass';
import checkAuth from '@/db/checkAuth';
import { hasDuplicates } from '@/lib/hasDuplicates';

export type AddCalendar = {
  name: string;
  description?: string;
  ownerIds?: string[];
  subscribers?: string[];
  pendingRequests?: string[];
  calendarColor?: string;
};

const addCalendar = async (calendar: AddCalendar) => {
  try {
    const currentUser = await checkAuth();

    // Validate calendar name
    if (!calendar.name) {
      throw new CustomError(403, 'Calendar name is required');
    }

    // Define calendar data
    const ownerIds = calendar.ownerIds
      ? calendar.ownerIds.concat(currentUser.uid)
      : [currentUser.uid];
    const subscribers = calendar.subscribers || [];
    const pendingRequests = calendar.pendingRequests || [];

    // validate arrays for uniqueness
    if (hasDuplicates(ownerIds)) {
      throw new CustomError(403, 'Owner IDs must be unique');
    }
    if (hasDuplicates(subscribers)) {
      throw new CustomError(403, 'Subscriber IDs must be unique');
    }
    if (hasDuplicates(pendingRequests)) {
      throw new CustomError(403, 'Pending Requests must be unique');
    }

    // Add calendar entry
    const calendarsRef = collection(db, 'calendars');
    const newCalendar = {
      ...calendar,
      ownerIds,
      subscribers,
      pendingRequests,
    };
    const calendarDocRef = await addDoc(calendarsRef, newCalendar);

    // Add calendarId inside the calendar document
    await updateDoc(calendarDocRef, { calendarId: calendarDocRef.id });

    // Update the  users subscribedCalendars array
    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
      subscribedCalendars: arrayUnion(calendarDocRef.id),
    });

    return calendarDocRef.id;
  } catch (error) {
    console.error('Error adding calendar: ', error);
    throw error;
  }
};

export default addCalendar;
