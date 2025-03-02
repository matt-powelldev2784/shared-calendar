import { CalendarNavigation } from "@/components/calendarNavigation/calendarNavigation";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  return <CalendarNavigation />;
}
