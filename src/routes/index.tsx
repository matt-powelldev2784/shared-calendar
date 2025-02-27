import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";

export const Route = createFileRoute("/")({
  component: App,
});

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
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  }).map((date) => ({
    dayName: format(date, "EEE"), // Short day name (e.g., Mon, Tue)
    dayDate: format(date, "d"), // Day of the month (e.g., 1, 2, 3)
  }));

  return (
    <nav className="flex w-screen flex-col items-center">
      <div className="hidden w-full flex-row sm:flex">
        {months.map((month) => {
          return (
            <Button variant="monthButton" size="monthButton">
              {month}
            </Button>
          );
        })}
      </div>

      <Carousel className="mt-2 w-full max-w-10/12">
        <CarouselContent>
          {months.map((month) => {
            return (
              <CarouselItem className="basis-1/3 text-center">
                <Button variant="monthButton" size="monthButton">
                  {month}
                </Button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="ml-2" />
        <CarouselNext className="mr-2" />
      </Carousel>

      <div className="relative block w-full bg-red-500">
        <Carousel className="mx-auto mt-2 w-full max-w-8/12">
          <CarouselContent>
            {daysInMonth.map((date) => {
              return (
                <CarouselItem className="basis-1/14 text-center">
                  <Button variant="dayButton" size="dayButton">
                    <span className="h-2">{date.dayDate}</span>
                    <span>{date.dayName}</span>
                  </Button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="ml-2" />
          <CarouselNext className="mr-2" />
        </Carousel>
      </div>
    </nav>
  );
}
