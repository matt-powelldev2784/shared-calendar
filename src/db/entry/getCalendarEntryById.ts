import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import { CustomError } from '@/ts/errorClass';
import type { CalendarEntry } from '@/ts/Calendar';

const getCalendarEntryById = async (entryId: string) => {
  try {
    const entryDocRef = doc(db, 'entries', entryId);
    const entryDoc = await getDoc(entryDocRef);
    const entryData = entryDoc.data();

    if (!entryData) {
      throw new CustomError(404, 'Calendar entry not found');
    }

    entryData.startDate = entryData.startDate.toDate();
    entryData.endDate = entryData.endDate.toDate();

    if (!entryDoc.exists()) {
      throw new CustomError(404, 'Calendar entry not found');
    }

    return entryData as CalendarEntry;
  } catch (error) {
    console.error('Error getting calendar entry: ', error);
    throw error;
  }
};

export default getCalendarEntryById;
