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
import { useState } from 'react';
import { signInWithGoogle } from '@/db/auth/signInWithGoogle';
import SharcIcon from '@/assets/logo/sharc_icon_orange.svg';
import { Mail } from 'lucide-react';

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

export const SignIn = () => {
  const [isSignInVisible, setSignInVisible] = useState(true);
  const [signInWithEmailIsVisible, setSignInWithEmailVisible] = useState(false);
  const [signUpWithEmailIsVisible, setSignUpWithEmailVisible] = useState(false);

  const handleSignInWithEmail = () => {
    setSignInWithEmailVisible(true);
    setSignUpWithEmailVisible(false);
    setSignInVisible(false);
  };

  const handleSignUpWithEmail = () => {
    setSignUpWithEmailVisible(true);
    setSignInWithEmailVisible(false);
    setSignInVisible(false);
  };

  return (
    <Card className="mx-auto mt-4 h-auto w-[95%] max-w-[400px]">
      {isSignInVisible && (
        <>
          <CardHeader>
            <img src={SharcIcon} alt="Sharc Logo" className="mx-auto h-8" />
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Welcome to Sharc Shared Calendar</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <Button className="w-full" variant="emailButton" size="xl" onClick={handleSignInWithEmail}>
              Sign in with Email
            </Button>

            <SignInWithGoogle />

            <p className="text-secondary mt-4 text-center text-sm">
              Don't have an account?{' '}
              <span className="text-primary font-bold" onClick={handleSignUpWithEmail}>
                Create one
              </span>
            </p>
          </CardContent>
        </>
      )}

      {signInWithEmailIsVisible && <SignInWithEmail />}
      {signUpWithEmailIsVisible && <SignUpWithEmail />}
    </Card>
  );
};

const SignInWithEmail = () => {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: 'testuser@testuser.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInFormSchema>) => {
    try {
      const { email, password } = data;
      await signInWithEmail(email, password);
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  return (
    <>
      <CardHeader>
        <Mail className="text-primary mx-auto" size={32} />
        <CardTitle className="text-center">Sign In With Email</CardTitle>
        <CardDescription className="text-center">Enter your details below to sign in</CardDescription>
      </CardHeader>

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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full max-w-[700px]">
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-5 w-full" variant="emailButton" size="xl">
              Sign in with Email
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
};

const SignUpWithEmail = () => {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: 'testuser@testuser.com',
      password: 'password123',
      password2: 'password123',
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpFormSchema>) => {
    try {
      const { email, password } = data;
      await signUpWithEmail(email, password);
      await createInitialUserDocuments();
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  return (
    <>
      <CardHeader>
        <Mail className="text-primary mx-auto" size={32} />
        <CardTitle className="text-center">Create Account</CardTitle>
        <CardDescription className="text-center">Enter email and password to create account</CardDescription>
      </CardHeader>
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
                  <FormMessage className="text-xs" />
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
                  <FormMessage className="text-xs" />
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
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button className="mt-5 w-full" variant="emailButton" size="xl">
              Sign Up with Email
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
