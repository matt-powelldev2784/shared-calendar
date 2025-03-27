import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import { CustomError } from '@/ts/errorClass';
import checkAuth from './checkAuth';

const getUserIdByEmail = async (email: string) => {
  try {
    const user = await checkAuth();

    if (!email) {
      throw new CustomError(400, 'Email is required');
    }

    const usersRef = collection(db, 'publicUsers');
    const emailQuery = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      throw new CustomError(404, 'No user found with the given email');
    }

    const userId = querySnapshot.docs[0].data().userId;

    if (!userId) {
      throw new CustomError(404, 'No user found with the given email');
    }

    if (userId === user.uid) {
      throw new CustomError(403, 'You cannot check your own email');
    }

    return userId as string;
  } catch (error) {
    console.error('Error getting userId by email: ', error);
    throw error;
  }
};

export default getUserIdByEmail;
