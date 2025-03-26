import { CustomError } from '@/ts/errorClass';
import { auth } from '@/db/firebaseConfig';
import { onAuthStateChanged, type User } from 'firebase/auth';

const checkAuth = async (): Promise<User> => {
  try {
    return new Promise((resolve, reject) => {
      // check if user is signed in
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          // user is authenticated, return user object
          resolve(user);
        } else {
          // user is not authenticated, reject with error
          console.error('User not authenticated');
          reject(new CustomError(401, 'User not authenticated'));
        }
      });
    });
  } catch (error) {
    console.error('Error in checkAuth:', error);
    throw error;
  }
};

export default checkAuth;
