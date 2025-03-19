import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SignIn } from '@/components/auth/signIn';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/db/firebaseConfig';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
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
    <section className="flex h-full w-full items-center">
      <SignIn />
    </section>
  );
}
