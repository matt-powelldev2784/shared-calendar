import { CalendarView } from "@/components/calenderView/calendarView";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center">
      <CalendarView />
    </section>
  );
}
