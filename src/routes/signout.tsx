import { SignOut } from "@/components/auth/signOut";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/db/firebaseConfig';
import { useEffect } from "react";

export const Route = createFileRoute("/signout")({
  component: SignOutPage,
});

function SignOutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate({ to: '/' });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <section className="flex h-full w-full items-center justify-center">
      <SignOut />
    </section>
  );
}
