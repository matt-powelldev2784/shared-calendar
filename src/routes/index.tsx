import { Calendar } from "@/components/calendar/calendar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  
  return <Calendar />;
}
