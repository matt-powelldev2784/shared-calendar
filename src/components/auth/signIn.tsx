import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import googleGIcon from '@/assets/icons/google_g_logo.svg';
import { SignInWithGoogle } from '@/db/auth/signInWithGoogle';

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
          onClick={() => SignInWithGoogle()}
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
