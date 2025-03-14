import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { CustomError } from '@/ts/errorClass';
import { db } from './firebaseConfig';
import checkAuth from './checkAuth';
import { type Calendar } from '@/ts/Calendar';

const getSubscribedCalendars = async () => {
  try {
    const currentUser = await checkAuth();

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new CustomError(404, 'User document does not exist');
    }

    const subscribedCalendars = userDoc.data().subscribedCalendars || [];

    if (!subscribedCalendars.length) {
      return [];
    }

    const calendarsQuery = query(
      collection(db, 'calendars'),
      where('calendarId', 'in', subscribedCalendars),
    );

    const querySnapshot = await getDocs(calendarsQuery);
    const calendars = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Calendar[];

    return calendars;
  } catch (error) {
    console.error('Error getting subscribed calendars: ', error);
    throw error;
  }
};

export default getSubscribedCalendars;
