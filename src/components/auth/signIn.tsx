import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import googleGIcon from '@/assets/icons/google_g_logo.svg';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { signInWithEmail, signUpWithEmail } from '@/db/auth/signInWithEmail';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createInitialUserDocuments } from '@/db/auth/createInitialUserDocuments';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { signInWithGoogle } from '@/db/auth/signInWithGoogle';
import SharcIcon from '@/assets/logo/sharc_icon_orange.svg';
import { Mail } from 'lucide-react';
import Loading from '../ui/loading';

const signInFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

const signUpFormSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    password2: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords don't match",
    path: ['password2'],
  });

type CurrentView = 'main' | 'signInEmail' | 'signUpEmail';
type MainViewProps = {
  setCurrentView: Dispatch<SetStateAction<CurrentView>>;
};
type SignInError = 'email-already-in-use' | 'unknown-error' | null;

export const SignIn = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('main');

  return (
    <Card className="relative mx-auto mt-4 h-auto w-[95%] max-w-[400px]">
      {currentView === 'main' && <MainView setCurrentView={setCurrentView} />}
      {currentView === 'signInEmail' && <SignInWithEmail />}
      {currentView === 'signUpEmail' && <SignUpWithEmail />}
    </Card>
  );
};

const MainView = ({ setCurrentView }: MainViewProps) => {
  return (
    <>
      <CardHeader>
        <img src={SharcIcon} alt="Sharc Logo" className="mx-auto h-8" />
        <CardTitle className="text-center">Sign In</CardTitle>
        <CardDescription className="text-center">Welcome to Sharc Shared Calendar</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button className="w-full" variant="emailButton" size="xl" onClick={() => setCurrentView('signInEmail')}>
          Sign in with Email
        </Button>

        <SignInWithGoogle />

        <p className="text-secondary mt-4 text-center text-sm">
          Don't have an account?{' '}
          <span className="text-primary font-bold" onClick={() => setCurrentView('signUpEmail')}>
            Create one
          </span>
        </p>
      </CardContent>
    </>
  );
};

const SignInWithEmail = () => {
  const [isError, setIsError] = useState(false);
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof signInFormSchema>) => {
    setIsError(false);
    try {
      const { email, password } = data;
      await signInWithEmail(email, password);
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setIsError(true);
    }
  };

  return (
    <>
      <CardHeader>
        <Mail className="text-primary mx-auto" size={32} />
        <CardTitle className="text-center">Sign In With Email</CardTitle>
        <CardDescription className="text-center">Enter your details below to sign in</CardDescription>
      </CardHeader>

      {isError && (
        <p className="px-8 text-center text-sm text-red-500">
          There was an error signing in. Please check your credentials and try again.
        </p>
      )}

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full max-w-[700px]">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage className="-translate-y-3 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-2 w-full max-w-[700px]">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage className="-translate-y-3 text-xs" />
                </FormItem>
              )}
            />

            <Button className="mt-8 w-full" variant="emailButton" size="xl">
              {isSubmitting ? <Loading variant={'sm'} /> : 'Sign In with Email'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
};

const SignUpWithEmail = () => {
  const [errorType, setErrorType] = useState<SignInError>(null);
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof signUpFormSchema>) => {
    setErrorType(null);
    try {
      const { email, password } = data;
      await signUpWithEmail(email, password);
      await createInitialUserDocuments();
    } catch (error: any) {
      console.error('Sign-up error:', error);
      if (error.code === 'auth/email-already-in-use') setErrorType('email-already-in-use');
      if (error.code !== 'auth/email-already-in-use') setErrorType('unknown-error');
    }
  };

  return (
    <>
      <CardHeader>
        <Mail className="text-primary mx-auto" size={32} />
        <CardTitle className="text-center">Create Account</CardTitle>
        <CardDescription className="text-center">Enter email and password to create account</CardDescription>
      </CardHeader>

      {errorType === 'email-already-in-use' && (
        <p className="px-8 text-center text-sm text-red-500">
          An account with this email already exists. Please sign in instead.
        </p>
      )}

      {errorType === 'unknown-error' && (
        <p className="px-8 text-center text-sm text-red-500">
          There was an error when creating the account. Please try again later.
        </p>
      )}

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full max-w-[700px]">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage className="-translate-y-3 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-2 w-full max-w-[700px]">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage className="-translate-y-3 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password2"
              render={({ field }) => (
                <FormItem className="mt-2 w-full max-w-[700px]">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password2" {...field} />
                  </FormControl>
                  <FormMessage className="-translate-y-3 text-xs" />
                </FormItem>
              )}
            />

            <Button className="mt-8 w-full" variant="emailButton" size="xl">
              {isSubmitting ? <Loading variant={'sm'} /> : 'Create Account'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
};

const SignInWithGoogle = () => {
  return (
    <Button onClick={() => signInWithGoogle()} className="w-full" variant="googleButton" size="xl">
      <img src={googleGIcon} alt="Google Icon" className="h-6" />

      <span className="flex-grow font-medium text-gray-800">Sign in with Google</span>
    </Button>
  );
};
