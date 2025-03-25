import { Button } from '@/components/ui/button';
import { CalendarCard } from '@/components/ui/calendarCard';

interface CalendarCardProps {
  entry: {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
  };
}

const PendingEntryCard = ({ entry }: CalendarCardProps) => {
  return (
    <article className="border-primary/75 flex w-full flex-col gap-2 rounded-xl border-3 border-dashed p-2">
      <CalendarCard entry={entry} variant="white" />
      <div className="flex gap-2 p-2">
        <Button variant="destructive" size="default" className="w-full">
          Reject
        </Button>
        <Button size="default" className="w-full">
          Accept
        </Button>
      </div>
    </article>
  );
};

export { PendingEntryCard };
