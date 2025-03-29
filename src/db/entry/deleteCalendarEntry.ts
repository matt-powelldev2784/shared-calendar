import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import checkAuth from '../auth/checkAuth';
import { CustomError } from '@/ts/errorClass';

const deleteCalendarEntry = async (entryId: string) => {
  try {
    const currentUser = await checkAuth();

    if (!entryId) {
      throw new CustomError(400, 'Entry ID is required');
    }

    const entryDocRef = doc(db, 'entries', entryId);
    const entryDoc = await getDoc(entryDocRef);

    if (!entryDoc.exists()) {
      throw new CustomError(404, 'Calendar entry not found');
    }

    const entryData = entryDoc.data();

    // Ensure the user is an owner of the entry
    if (!entryData?.ownerIds?.includes(currentUser.uid)) {
      throw new CustomError(
        403,
        'You do not have permission to delete this entry',
      );
    }

    await deleteDoc(entryDocRef);

    return { success: true, message: 'Calendar entry deleted successfully' };
  } catch (error) {
    console.error('Error deleting calendar entry: ', error);
    throw error;
  }
};

export default deleteCalendarEntry;
