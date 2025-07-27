import { signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/db/firebaseConfig';

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential) {
      console.error('Error in user Credential');
      return;
    }
    const token = credential.accessToken;
    const user = result.user;

    return { user, token };
  } catch (error: any) {
    console.error('Error during sign-in:', error);
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log('errorCode', errorCode);
    console.log('errorMessage', errorMessage);
    console.log('email', email);
    console.log('credential', credential);
    throw error;
  }
};
