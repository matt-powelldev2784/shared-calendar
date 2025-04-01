import {
  collection,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import checkAuth from '../auth/checkAuth';
import { CustomError } from '@/ts/errorClass';

const deleteCalendarEntry = async (entryId: string) => {
  try {
    const currentUser = await checkAuth();

    if (!entryId) {
      throw new CustomError(400, 'Entry ID is required');
    }

    // Reference to the calendar entry
    const entryDocRef = doc(db, 'entries', entryId);
    const entryDoc = await getDoc(entryDocRef);
    const entryData = entryDoc.data();

    if (!entryData) {
      throw new CustomError(404, 'Calendar entry not found');
    }

    // Query related requests
    const requestsRef = collection(db, 'requests');
    const relatedRequestsQuery = query(
      requestsRef,
      where('entryId', '==', entryId),
    );
    const relatedRequestsSnapshot = await getDocs(relatedRequestsQuery);

    if (!entryData) {
      throw new CustomError(404, 'Calendar entry not found');
    }

    // run a transaction to delete the entry and related requests
    await runTransaction(db, async (transaction) => {
      const entryDoc = await transaction.get(entryDocRef);
      if (!entryDoc.exists()) {
        throw new CustomError(404, 'Calendar entry not found');
      }

      const entryData = entryDoc.data();
      if (!entryData.ownerIds.includes(currentUser.uid)) {
        throw new CustomError(
          403,
          'You do not have permission to delete this entry',
        );
      }

      transaction.delete(entryDocRef);
      relatedRequestsSnapshot.forEach((requestDoc) => {
        transaction.delete(requestDoc.ref);
      });
    });

    return {
      success: true,
      message: `Calendar entry ${entryData.entryId} and related requests deleted successfully`,
    };
  } catch (error) {
    console.error('Error deleting calendar entry: ', error);
    throw error;
  }
};

export default deleteCalendarEntry;
