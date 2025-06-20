import { doc, runTransaction, arrayRemove } from 'firebase/firestore';
import { db } from '@/db/firebaseConfig';
import checkAuth from '@/db//auth/checkAuth';
import { CustomError } from '@/ts/errorClass';

type RejectPendingEntry = { entryId: string; requestId: string };

const rejectPendingEntry = async ({
  entryId,
  requestId,
}: RejectPendingEntry) => {
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

      const entryDoc = await transaction.get(entryDocRef);
      if (!entryDoc.exists()) {
        throw new CustomError(404, 'Entry not found');
      }

      // remove the current user from the subscribers array
      // and remove them from the pending requests
      transaction.update(entryDocRef, {
        subscribers: arrayRemove(user.uid),
        pendingRequests: arrayRemove(user.uid),
      });

      // Remove the user from the request
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
    console.error('Error rejecting pending entry: ', error);
    throw error;
  }
};

export default rejectPendingEntry;
