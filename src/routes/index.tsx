import { CalendarNavigation } from "@/components/calendar/calendarNavigation";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <>
      <CalendarNavigation />
    </>
  );
}
