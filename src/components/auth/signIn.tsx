import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import googleGIcon from "@/assets/icons/google_g_logo.svg";

export const SignIn = () => {
  return (
    <Card className="mx-auto mt-4 w-[95%] max-w-[400px]">
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Click the button below to sign in.
        </CardDescription>
      </CardHeader>

      <CardContent className="h-12">
        <Button
          onClick={SignInWithGoogle}
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

const SignInWithGoogle = async () => {
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

    // Check if the user is signing in for the first time
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create a new user document
      await setDoc(userDocRef, {
        displayName: user.displayName,
        email: user.email,
        subscribedCalendars: [],
      });

      // create a public user document
      // this is used to share calendars and entries with other users
      const publicUserDocRef = doc(db, "publicUsers", user.uid);
      await setDoc(publicUserDocRef, {
        email: user.email,
        userId: user.uid,
      });

      // create a default calendar for the new user
      const defaultCalendarRef = await addDoc(collection(db, "calendars"), {
        name: `${user.displayName} Main`,
        description: "This is your default calendar.",
        ownerIds: [user.uid],
        subscribers: [user.uid],
        pendingRequests: [],
      });

      // add the default calendar to the user's subscribedCalendars array
      await updateDoc(userDocRef, {
        subscribedCalendars: arrayUnion(defaultCalendarRef.id),
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
