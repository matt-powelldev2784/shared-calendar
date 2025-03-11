import { CustomError } from '@/ts/errorClass';
import { auth } from '@/db/firebaseConfig';
import { onAuthStateChanged, type User } from 'firebase/auth';

const checkAuth = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    // check is user is signed in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        // user is authenticated return user object
        resolve(user);
      } else {
        // user is not authenticated reject with error
        console.error('User not authenticated');
        reject(new CustomError(401, 'User not authenticated'));
      }
    });
  });
};

export default checkAuth;
