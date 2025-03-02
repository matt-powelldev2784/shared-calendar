import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import googleGIcon from "@/assets/icons/google_g_logo.svg";

export const SignIn = () => {
  return (
    <Card className="mx-auto mt-4 w-[95%] max-w-[400px]">
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
      </CardHeader>

      <CardContent className="h-12">
        <Button
          onClick={SignUpWithGoogle}
          className="w-full"
          variant="googleButton"
          size="xl"
        >
          <img src={googleGIcon} alt="Google Icon" className="h-6" />

          <span className="flex-grow font-medium text-gray-800">
            Sign in with Google
          </span>
        </Button>
      </CardContent>
    </Card>
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
