import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/db/firebaseConfig';

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user };
  } catch (error: any) {
    console.error('Error during email sign-in:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user };
  } catch (error: any) {
    console.error('Error during email sign-up:', error);
    throw error;
  }
};

export const signInWithEmailForDemo = async () => {
  const email = `testuser${Date.now()}@testuser.com`;
  console.log('email', email);
  const password = 'password123';
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user };
  } catch (error: any) {
    console.error('Error during demo email sign-in:', error);
    throw error;
  }
};
