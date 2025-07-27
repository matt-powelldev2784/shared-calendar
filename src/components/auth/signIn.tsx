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

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const SignIn = () => {
  return (
    <Card className="mx-auto mt-4 h-auto w-[95%] max-w-[400px]">
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
        <CardDescription className="text-center">Click the button below to sign in.</CardDescription>
      </CardHeader>
      <SignInWithEmail />
      <SignUpWithEmail />
      <SignInWithGoogle />
    </Card>
  );
};

const SignInWithEmail = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'testuser@testuser.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { email, password } = data;
      await signInWithEmail(email, password);
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  return (
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

          <Button className="w-full" variant="emailButton" size="xl">
            Sign in with Email
          </Button>
        </form>
      </Form>
    </CardContent>
  );
};

const SignUpWithEmail = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'testuser@testuser.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { email, password } = data;
      await signUpWithEmail(email, password);
      await createInitialUserDocuments();
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  return (
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

          <Button className="w-full" variant="emailButton" size="xl">
            Sign Up with Email
          </Button>
        </form>
      </Form>
    </CardContent>
  );
};

const SignInWithGoogle = () => {
  return (
    <CardContent className="">
      <Button onClick={() => SignInWithGoogle()} className="w-full" variant="googleButton" size="xl">
        <img src={googleGIcon} alt="Google Icon" className="h-6" />

        <span className="flex-grow font-medium text-gray-800">Sign in with Google</span>
      </Button>
    </CardContent>
  );
};
