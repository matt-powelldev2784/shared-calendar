import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import { CustomError } from '@/ts/errorClass';
import type { CalendarEntry } from '@/ts/Calendar';

const getCalendarEntryById = async (entryId: string) => {
  try {
    const entryDocRef = doc(db, 'entries', entryId);
    const entryDoc = await getDoc(entryDocRef);

    if (!entryDoc.exists()) {
      throw new CustomError(404, 'Calendar entry not found');
    }

    return entryDoc.data() as CalendarEntry;
  } catch (error) {
    console.error('Error getting calendar entry: ', error);
    throw error;
  }
};

export default getCalendarEntryById;
