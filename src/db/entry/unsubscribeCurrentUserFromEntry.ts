import { doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import checkAuth from '../auth/checkAuth';
import { CustomError } from '@/ts/errorClass';

const unsubscribeCurrentUserFromEntry = async (entryId: string) => {
  try {
    const currentUser = await checkAuth();

    if (!entryId) {
      throw new CustomError(400, 'Entry ID is required');
    }

    const entryDocRef = doc(db, 'entries', entryId);
    const entryDoc = await getDoc(entryDocRef);

    if (!entryDoc.exists()) {
      throw new CustomError(404, 'Entry not found');
    }

    // Remove the current user from the subscribers array
    await updateDoc(entryDocRef, {
      subscribers: arrayRemove(currentUser.uid),
    });

    return {
      success: true,
      message: `The current user ${currentUser.email} have been removed from the subscribers list`,
    };
  } catch (error) {
    console.error('Error removing subscriber from entry:', error);
    throw error;
  }
};

export default unsubscribeCurrentUserFromEntry;
