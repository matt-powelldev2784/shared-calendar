import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import checkAuth from '@/db/auth/checkAuth';
import type { User } from 'firebase/auth';
import { createSampleEntires } from './createSampleEntries';

// if the user is signing in for the first time
// this function will create a user document, public user document and
// default calendar document
// if the documents already exist, it will return the user document
export const createInitialUserDocuments = async () => {
  try {
    const user = await checkAuth();

    // Check if the user is signing in for the first time
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        displayName: user.displayName,
        email: user.email,
        subscribedCalendars: [],
        userId: user.uid,
      });

      // create a public user document
      // this is used to share calendars and entries with other users
      const publicUserDocRef = doc(db, 'publicUsers', user.uid);
      await setDoc(publicUserDocRef, {
        email: user.email,
        userId: user.uid,
      });

      // create a default calendar for the new user
      const calendarDocRef = doc(collection(db, 'calendars'));
      await setDoc(calendarDocRef, {
        calendarId: calendarDocRef.id,
        name: `${user.displayName} Calendar`,
        description: 'This is your default calendar.',
        ownerIds: [user.uid],
        subscribers: [user.uid],
        pendingRequests: [],
      });

      // add the default calendar to the user's subscribedCalendars array
      await updateDoc(userDocRef, {
        subscribedCalendars: arrayUnion(calendarDocRef.id),
        defaultCalendarId: calendarDocRef.id,
      });

      createSampleEntires(calendarDocRef.id);
    }

    const currentUserDoc = await getDoc(userDocRef);
    const userData = currentUserDoc.data();

    return userData as User;
  } catch (error) {
    console.error('Error adding default calendar:', error);
    throw error;
  }
};
