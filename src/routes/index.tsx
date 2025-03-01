import { Calendar } from "@/components/calendar/calendar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <nav className="flex w-screen flex-col items-center">
      <div className="bg-primary flex w-full items-center justify-center py-2 text-xl font-bold text-white">
        Sharc
      </div>

      <Calendar />

      <div className="w-full bg-red-500 lg:bg-blue-500 xl:bg-green-500">1</div>
    </nav>
  );
}
