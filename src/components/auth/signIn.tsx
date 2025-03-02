import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const SignIn = () => {
  return (
    <div className="mt-4 flex flex-row gap-2">
      <button
        type="button"
        data-te-ripple-init
        data-te-ripple-color="light"
        className="mb-2 flex rounded px-6 py-2.5 text-xs leading-normal font-medium text-white uppercase shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:ring-0 focus:outline-none active:shadow-lg"
        style={{ backgroundColor: "#ea4335" }}
        onClick={SignUpWithGoogle}
      >
        Google
      </button>
    </div>
  );
};

const SignUpWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential) {
      console.error("Error in user Credential");
      return;
    }
    const token = credential.accessToken;
    const user = result.user;
    console.log(user, token);

    // get user document
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);


    if (userDoc.exists()) {
      // Update the user details on each login
      await updateDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
      });
    } else {
      // Create a new user document if it doesn't exist
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        createdAt: new Date(),
      });
    }
  } catch (error: any) {
    console.error("Error during sign-in:", error);
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log("errorCode", errorCode);
    console.log("errorMessage", errorMessage);
    console.log("email", email);
    console.log("credential", credential);
  }
};
