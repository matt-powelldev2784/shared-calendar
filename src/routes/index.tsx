import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/db/firebaseConfig';
import { SignIn } from "@/components/auth/signIn";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // if the user is signed in, redirect to the calendar
        navigate({ to: "/calendar" });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <section className="flex h-full w-full items-center">
      <SignIn />
    </section>
  );
}

