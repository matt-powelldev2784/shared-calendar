import { signOut as signoutFirebase } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export const signOut = async () => {
  try {
    await signoutFirebase(auth);
    console.log("User signed out successfully");
  } catch (e) {
    console.error("Error signing out: ", e);
  }
};

export const SignOut = () => {
  return (
    <Card className="mx-auto mt-4 w-[95%] max-w-[400px]">
      <CardHeader>
        <CardTitle className="text-center">Sign Out</CardTitle>
        <CardDescription className="text-center">
          Click the button below to sign out
        </CardDescription>
      </CardHeader>

      <CardContent className="h-12">
        <Button
          onClick={signOut}
          className="w-full"
          variant="googleButton"
          size="xl"
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};
