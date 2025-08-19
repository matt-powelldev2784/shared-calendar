import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SignIn } from '@/components/auth/signIn';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/db/firebaseConfig';
import { Navbar } from '@/components/navbar/navbar';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate({ to: `/authenticated` });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <main>
      <Navbar />
      <section className="flex h-full w-full flex-col items-center justify-center px-4">
        <SignIn />
      </section>
    </main>
  );
}
