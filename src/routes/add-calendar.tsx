import AddCalendar from '@/components/addCalendar/addCalendar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/add-calendar')({
  component: AddEntryPage,
});

function AddEntryPage() {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center">
      <AddCalendar />
    </section>
  );
}
