import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import { CustomError } from '@/ts/errorClass';
import checkAuth from '@/db/auth/checkAuth';
import type { UserDocument } from '@/ts/Calendar';

const getUserDocument = async () => {
  try {
    const user = await checkAuth();

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new CustomError(404, 'User document not found');
    }

    const userData = userDoc.data();

    return userData as UserDocument;
  } catch (error) {
    console.error('Error getting user document: ', error);
    throw error;
  }
};

export default getUserDocument;
