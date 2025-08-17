import { signOut as signoutFirebase } from "firebase/auth";
import { auth } from '@/db/firebaseConfig';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useNavigate } from '@tanstack/react-router';

export const SignOut = () => {
  const navigate = useNavigate();

  const signOut = async () => {
    await signoutFirebase(auth);
    navigate({ to: '/' });
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Sign Out</CardTitle>
      </CardHeader>

      <CardDescription className="text-center">Click the button below to sign out</CardDescription>

      <CardContent className="h-12 px-4">
        <Button onClick={signOut} variant="loginButtonSecondary" size="xl">
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};
