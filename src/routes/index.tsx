import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
})

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function App() {
  return (
    <nav>
      <div className="hidden w-full flex-row bg-orange-500 sm:flex sm:bg-blue-500">
        {months.map((month) => {
          return (
            <Button variant="monthButton" size="monthButton">
              {month}
            </Button>
          );
        })}
      </div>

      <div className="flex w-full flex-row bg-orange-500 sm:hidden sm:bg-blue-500">
        {months.map((month) => {
          return (
            <Button variant="monthButton" size="monthButton">
              {month}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
