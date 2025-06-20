import {
  doc,
  runTransaction,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import checkAuth from '../auth/checkAuth';
import { CustomError } from '@/ts/errorClass';

type AcceptPendingEntry = { entryId: string; requestId: string };

const acceptPendingEntry = async ({
  entryId,
  requestId,
}: AcceptPendingEntry) => {
  try {
    const user = await checkAuth();

    if (!entryId || !requestId) {
      throw new CustomError(400, 'Entry ID and Request ID are required');
    }

    const entryDocRef = doc(db, 'entries', entryId);
    const requestDocRef = doc(db, 'requests', requestId);

    await runTransaction(db, async (transaction) => {
      const requestDoc = await transaction.get(requestDocRef);
      if (!requestDoc.exists()) {
        throw new CustomError(404, 'Request not found');
      }

      const requestData = requestDoc.data();
      const requestUserIds = requestData?.requestedUserIds;

      if (!requestUserIds) {
        throw new CustomError(404, 'Invalid request data');
      }

      // add the current user to the subscribers array
      // and remove them from the pending requests
      transaction.update(entryDocRef, {
        subscribers: arrayUnion(user.uid),
        pendingRequests: arrayRemove(user.uid),
      });

      // remove the user from the request
      // if no more users are in the request, delete the request document
      if (requestUserIds.length === 1) {
        transaction.delete(requestDocRef);
      } else {
        transaction.update(requestDocRef, {
          requestedUserIds: requestUserIds.filter(
            (id: string) => id !== user.uid,
          ),
        });
      }
    });
  } catch (error) {
    console.error('Error accepting pending entry: ', error);
    throw error;
  }
};

export default acceptPendingEntry;
