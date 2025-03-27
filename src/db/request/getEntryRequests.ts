import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import checkAuth from '@/db/auth/checkAuth';
import { type Request } from '@/ts/Calendar';

const getEntryRequests = async () => {
  try {
    const user = await checkAuth();

    const requestsRef = collection(db, 'requests');
    const q = query(
      requestsRef,
      where('requestedUserIds', 'array-contains', user.uid),
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const requests = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    return requests as Request[];
  } catch (error) {
    console.error('Error getting requests: ', error);
    throw error;
  }
};

export default getEntryRequests;
