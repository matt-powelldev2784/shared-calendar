import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { SignIn } from '@/components/auth/signIn';
import { useEffect } from 'react';
import Error from '@/components/ui/error';
import type { CustomError } from '@/ts/errorClass';
import { addDefaultCalendar } from '@/db/addDefaultCalendar';

export const Route = createFileRoute('/authenticated')({
  component: AuthenticatedPage,

  loader: async () => {
    const user = await addDefaultCalendar();
    return user;
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function AuthenticatedPage() {
  const navigate = useNavigate();
  const user = useLoaderData({ from: '/authenticated' });

  useEffect(() => {
    if (user) navigate({ to: `/default-calendar` });
  }, [user]);

  return (
    <section className="flex h-full w-full items-center">
      <SignIn />
    </section>
  );
}
