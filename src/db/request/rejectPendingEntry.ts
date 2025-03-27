import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import checkAuth from '@/db//auth/checkAuth';
import { CustomError } from '@/ts/errorClass';

type RejectPendingEntry = { requestId: string };

const rejectPendingEntry = async ({ requestId }: RejectPendingEntry) => {
  try {
    const user = await checkAuth();

    if (!requestId) {
      throw new CustomError(400, 'Request ID is required');
    }

    const requestDocRef = doc(db, 'requests', requestId);

    // Fetch the request document
    const requestDoc = await getDoc(requestDocRef);
    if (!requestDoc.exists()) {
      throw new CustomError(404, 'Request not found');
    }

    const requestData = requestDoc.data();
    const requestUserIds = requestData?.requestedUserIds;

    if (!requestUserIds) {
      throw new CustomError(404, 'Invalid request data');
    }

    // remove the user from the request
    // if no more users are in the request, delete the request document
    if (requestUserIds.length === 1) {
      await deleteDoc(requestDocRef);
    } else {
      await updateDoc(requestDocRef, {
        requestedUserIds: requestUserIds.filter(
          (id: string) => id !== user.uid,
        ),
      });
    }
  } catch (error) {
    console.error('Error rejecting pending entry: ', error);
    throw error;
  }
};

export default rejectPendingEntry;
