import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import Error from '@/components/ui/error';
import Loading from '@/components/ui/loading';
import type { CustomError } from '@/ts/errorClass';
import getCalendarEntryById from '@/db/entry/getCalendarEntryById';
import { z } from 'zod';
import { getEmailsFromUserIds } from '@/db/auth/getEmailsFromUserIds';
import getUserDocument from '@/db/auth/getUserDocument';
import ViewEntry from '@/components/viewEntry/viewEntry';

const entrySearchSchema = z.object({
  entryId: z.string(),
});

export const Route = createFileRoute('/view-entry')({
  component: ViewEntryPage,
  pendingComponent: () => <Loading classNames="w-full mx-auto mt-4" />,

  loaderDeps: ({ search }) => ({
    entryId: search.entryId,
  }),

  validateSearch: entrySearchSchema,

  loader: async ({ deps: { entryId } }) => {
    const entry = await getCalendarEntryById(entryId);
    const entrySubscribers = await getEmailsFromUserIds(entry.subscribers);
    const pendingSubscribers = await getEmailsFromUserIds(
      entry.pendingRequests,
    );
    const ownerEmails = await getEmailsFromUserIds(entry.ownerIds);
    const currentUser = await getUserDocument();
    
    return {
      entry,
      entrySubscribers,
      pendingSubscribers,
      ownerEmails,
      currentUser,
    };
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function ViewEntryPage() {
  const viewEntryProps = useLoaderData({
    from: '/view-entry',
  });

  return <ViewEntry {...viewEntryProps} />;
}
