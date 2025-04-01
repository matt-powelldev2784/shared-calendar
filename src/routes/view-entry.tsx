import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import Error from '@/components/ui/error';
import Loading from '@/components/ui/loading';
import type { CustomError } from '@/ts/errorClass';
import getCalendarEntryById from '@/db/entry/getCalendarEntryById';
import { z } from 'zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { AtSign, ClockIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { getEmailsFromUserIds } from '@/db/auth/getEmailsFromUserIds';

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
    return { entry, entrySubscribers };
  },

  errorComponent: ({ error }) => {
    return <Error error={error as CustomError} />;
  },
});

function ViewEntryPage() {
  const { entry, entrySubscribers } = useLoaderData({
    from: '/view-entry',
  });

  return (
    <section className="flex h-full w-full flex-col items-center">
      <Card className="mx-auto mt-4 w-[95%] max-w-[700px]">
        <CardHeader className="flex flex-col items-center">
          <Info className="text-primary mr-2 inline-block h-12 w-12" />
          <CardTitle className="text-center">Calendar Entry Details</CardTitle>
          <CardDescription className="text-center">
            View calendar entry detail below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="border-secondary/25 mb-2 rounded-lg border-2 p-2">
            <p className="text-lg font-bold">Title</p>
            <p className="text-secondary">{entry.title}</p>
          </div>

          <div className="border-secondary/25 mb-2 rounded-lg border-2 p-2">
            <p className="text-lg font-bold">Description</p>
            <p className="text-secondary">
              {entry.description
                ? entry.description
                : 'No description provided'}
            </p>
          </div>

          <div className="border-secondary/25 mb-2 rounded-lg border-2 p-2">
            <p className="text-lg font-bold">Time</p>
            <p className="text-secondary flex items-center gap-2">
              <ClockIcon size={20} />
              {format(entry.startDate, 'HH:mm')}-
              {format(entry.endDate, 'HH:mm')}
            </p>
          </div>

          <div className="mb-2 p-2 py-4">
            <p className="pb-2 text-center text-lg font-bold">Attendees</p>
            {entrySubscribers.length > 0 && (
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {entrySubscribers.map((email) => {
                  return (
                    <li
                      key={email}
                      className="border-secondary/25 text-secondary flex w-full flex-grow items-center justify-between gap-2 rounded-md border-1 px-4 py-1"
                    >
                      <AtSign />
                      <p className="w-full truncate text-center text-xs text-black sm:text-sm">
                        {email}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
