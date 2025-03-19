import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/db/firebaseConfig';
import { SignIn } from '@/components/auth/signIn';
import checkAuth from '@/db/checkAuth';

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const currentUser = checkAuth();
    return currentUser;
  },
  errorComponent: App,
});

function App() {
  const navigate = useNavigate();
  const currentUser = useLoaderData({ from: '/' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate({ to: `/default-calendar` });
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <section className="flex h-full w-full items-center">
      <SignIn />
    </section>
  );
}
