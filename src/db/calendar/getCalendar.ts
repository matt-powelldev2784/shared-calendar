import { doc, getDoc } from 'firebase/firestore';
import { CustomError } from '@/ts/errorClass';
import { db } from '@/db/firebaseConfig';
import checkAuth from '@/db/auth/checkAuth';
import { type Calendar } from '@/ts/Calendar';

const getCalendars = async (calendarIds: string[]) => {
  try {
    await checkAuth();

    const calendarPromises = calendarIds.map(async (calendarId) => {
      const calendarDocRef = doc(db, 'calendars', calendarId);
      const calendarDoc = await getDoc(calendarDocRef);

      if (!calendarDoc.exists()) {
        throw new CustomError(
          404,
          `Calendar document with ID ${calendarId} does not exist`,
        );
      }

      return calendarDoc.data() as Calendar;
    });

    const calendars = await Promise.all(calendarPromises);
    return calendars;
  } catch (error) {
    console.error('Error getting calendars: ', error);
    throw error;
  }
};

export default getCalendars;
