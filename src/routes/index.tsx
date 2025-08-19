import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/db/firebaseConfig';
import Homepage from '@/components/homepage/homepage';

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

  return <Homepage />;
}
