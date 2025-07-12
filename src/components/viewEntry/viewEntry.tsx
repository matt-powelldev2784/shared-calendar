import deleteCalendarEntry from '@/db/entry/deleteCalendarEntry';
import unsubscribeCurrentUserFromEntry from '@/db/entry/unsubscribeCurrentUserFromEntry';
import type { CalendarEntry, UserDocument } from '@/ts/Calendar';
import type { CustomError } from '@/ts/errorClass';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { AtSign, CalendarDays, ClockIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';

type ViewEntryProps = {
  entry: CalendarEntry;
  entrySubscribers: string[];
  pendingSubscribers: string[];
  ownerEmails: string[];
  currentUser: UserDocument;
};

const ViewEntry = ({
  entry,
  entrySubscribers,
  pendingSubscribers,
  ownerEmails,
  currentUser,
}: ViewEntryProps) => {
  const currentUserIsOwner = ownerEmails.includes(currentUser.email);
  const navigate = useNavigate();

  const deleteEntry = useMutation({
    mutationFn: async () => {
      await deleteCalendarEntry(entry.entryId);
    },
    onSuccess: () => {
      navigate({ to: `/authenticated` });
    },
    onError: (error: CustomError) => {
      const status = error?.status || 500;
      const message = 'Error deleting calendar entry';
      navigate({ to: `/error?status=${status}&message=${message}` });
    },
  });

  const unsubscribeCurrentUser = useMutation({
    mutationFn: async () => {
      await unsubscribeCurrentUserFromEntry(entry.entryId);
    },
    onSuccess: () => {
      navigate({ to: `/authenticated` });
    },
    onError: (error: CustomError) => {
      const status = error?.status || 500;
      const message = 'Error unsubscribing from calendar entry';
      navigate({ to: `/error?status=${status}&message=${message}` });
    },
  });

  return (
    <section className="flex h-full w-full flex-col items-center">
      <Card className="mx-auto mt-4 mb-24 w-full max-w-[700px] border-0 shadow-none sm:w-[95%] sm:border-2">
        <CardHeader className="flex flex-col items-center">
          <Info className="text-primary mr-2 inline-block h-12 w-12" />
          <CardTitle className="text-center">Calendar Entry Details</CardTitle>
          <CardDescription className="text-center">
            View calendar entry detail below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-2 py-4">
            <p className="pb-2 text-center text-lg font-bold">
              Entry Organisers
            </p>

            {ownerEmails.length > 0 && (
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {ownerEmails.map((email) => {
                  return (
                    <li
                      key={email}
                      className="border-secondary/25 text-secondary flex w-full flex-grow items-center justify-between gap-2 rounded-md border-2 px-4 py-1"
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

          <div className="border-secondary/25 mb-2 rounded-lg border-2 p-2">
            <p className="font-bold">Title</p>
            <p className="text-secondary text-lg">{entry.title}</p>
          </div>

          <div className="border-secondary/25 mb-2 rounded-lg border-2 p-2">
            <p className="font-bold">Description</p>
            <p className="text-secondary text-lg">
              {entry.description
                ? entry.description
                : 'No description provided'}
            </p>
          </div>

          <div className="border-secondary/25 mb-2 rounded-lg border-2 p-2">
            <p className="font-bold">Date</p>
            <p className="text-secondary flex items-center gap-2 text-lg">
              <CalendarDays size={20} />
              {format(entry.startDate, 'dd-MM-yyyy')}
            </p>
          </div>

          <div className="border-secondary/25 mb-2 rounded-lg border-2 p-2">
            <p className="font-bold">Time</p>

            <p className="text-secondary flex items-center gap-2 text-lg">
              <ClockIcon size={20} />
              {format(entry.startDate, 'HH:mm')}-
              {format(entry.endDate, 'HH:mm')}
            </p>
          </div>

          {entrySubscribers.length > 0 && (
            <div className="mb-2 py-4">
              <p className="pb-2 text-center text-lg font-bold">Attendees</p>

              <ul className="flex flex-wrap items-center justify-center gap-2">
                {entrySubscribers.map((email) => {
                  return (
                    <li
                      key={email}
                      className="border-secondary/25 text-secondary flex w-full flex-grow items-center justify-between gap-2 rounded-md border-2 px-4 py-1"
                    >
                      <AtSign />
                      <p className="w-full truncate text-center text-xs text-black sm:text-sm">
                        {email}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {pendingSubscribers.length > 0 && (
            <div className="mb-2 py-4">
              <p className="text-secondary/75 pb-2 text-center text-lg font-bold">
                Response Pending
              </p>

              <ul className="flex flex-wrap items-center justify-center gap-2">
                {pendingSubscribers.map((email) => {
                  return (
                    <li
                      key={email}
                      className="border-secondary/25 text-secondary/25 flex w-full flex-grow items-center justify-between gap-2 rounded-md border-2 border-dashed px-4 py-1"
                    >
                      <AtSign />
                      <p className="text-secondary/75 w-full truncate text-center text-xs sm:text-sm">
                        {email}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {currentUserIsOwner && (
            <>
              <Button
                variant="default"
                size="default"
                className="mx-auto mt-4 w-full"
                onClick={() => {
                  navigate({ to: `/edit-entry?entryId=${entry.entryId}` });
                }}
              >
                Edit Entry
              </Button>

              <Button
                variant="destructive"
                size="default"
                className="mx-auto mt-4 w-full"
                onClick={() => {
                  deleteEntry.mutate();
                }}
              >
                Delete Entry
              </Button>
            </>
          )}

          {!currentUserIsOwner && (
            <Button
              variant="destructive"
              size="default"
              className="mx-auto mt-4 w-full"
              onClick={() => {
                unsubscribeCurrentUser.mutate();
              }}
            >
              Opt Out of Event
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default ViewEntry;