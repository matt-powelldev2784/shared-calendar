import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import checkAuth from './checkAuth';
import { CustomError } from '@/ts/errorClass';

const addSubscriberToEntry = async (entryId: string) => {
  try {
    const user = await checkAuth();

    if (!entryId) {
      throw new CustomError(400, 'Entry ID is required');
    }

    const entryDocRef = doc(db, 'entries', entryId);

    if (!entryDocRef) {
      throw new CustomError(404, 'Entry not found');
    }

    // add the current user to the subscribers array
    await updateDoc(entryDocRef, {
      subscribers: arrayUnion(user.uid),
    });
  } catch (error) {
    console.error('Error adding subscriber to entry: ', error);
    throw error;
  }
};

export default addSubscriberToEntry;
