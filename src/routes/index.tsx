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
import { useEffect } from "react";

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
    start: startOfMonth(new Date("2022-01-01")),
    end: endOfMonth(new Date("2022-01-31")),
  }).map((date) => ({
    dayName: format(date, "EEE"), // day of week (e.g., Mon, Tue, Wed)
    dayDate: format(date, "d"), // day of  month (e.g., 1, 2, 3)
  }));

  useEffect(() => {
    console.log("window.innerWidth:", window.innerWidth);
  }, []);

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

      <Carousel className="w-full">
        <CarouselContent className="wide:justify-center mx-2">
          {daysInMonth.map((date) => {
            return (
              <CarouselItem className="flex h-16 basis-12 items-center justify-center text-center">
                <Button variant="dayButtonDefault" size="dayButton">
                  <span className="font-bold">{date.dayDate}</span>
                  <span className="text-xs">{date.dayName}</span>
                </Button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/* <CarouselPrevious className="ml-2" />
          <CarouselNext className="mr-2" /> */}
      </Carousel>
    </nav>
  );
}
