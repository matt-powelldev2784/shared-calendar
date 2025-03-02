import { CalendarNavigation } from "@/components/calendarNavigation/calendarNavigation";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <section className="flex h-full w-full items-center justify-center">
      <CalendarNavigation />
    </section>
  );
}
