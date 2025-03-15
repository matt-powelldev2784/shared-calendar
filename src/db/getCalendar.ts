import { doc, getDoc } from 'firebase/firestore';
import { CustomError } from '@/ts/errorClass';
import { db } from './firebaseConfig';
import checkAuth from './checkAuth';
import { type Calendar } from '@/ts/Calendar';

const getCalendar = async (calendarId: string) => {
  try {
    await checkAuth();

    const calenderDocRef = doc(db, 'calendars', calendarId);
    const calenderDoc = await getDoc(calenderDocRef);

    if (!calenderDoc.exists()) {
      throw new CustomError(404, 'Calendar document does not exist');
    }

    const calendar = calenderDoc.data() as Calendar;

    return calendar;
  } catch (error) {
    console.error('Error getting subscribed calendars: ', error);
    throw error;
  }
};

export default getCalendar;
