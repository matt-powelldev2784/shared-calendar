import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import { CustomError } from '@/ts/errorClass';

export const getEmailsFromUserIds = async (userIds: string[]) => {
  try {
    if (!userIds || userIds.length === 0) {
      return []; 
    }

    const publicUsersRef = collection(db, 'publicUsers');
    const userEmailsQuery = query(
      publicUsersRef,
      where('userId', 'in', userIds),
    );
    const userEmailsSnapshot = await getDocs(userEmailsQuery);

    if (userEmailsSnapshot.empty) {
      throw new CustomError(404, 'No users found for the provided user IDs.');
    }

    const emails = userEmailsSnapshot.docs.map((doc) => doc.data().email);
    return emails;
  } catch (error) {
    console.error('Error getting emails from user IDs: ', error);
    throw error;
  }
};
