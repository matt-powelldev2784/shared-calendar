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
      <div className="bg-primary flex w-full items-center justify-center py-2 text-xl font-bold text-white">
        Sharc
      </div>

      <Carousel className="mt-2 mr-2 w-full">
        <CarouselContent className="mx-2">
          {months.map((month) => {
            return (
              <CarouselItem className="text-center md:basis-1/12">
                <Button variant="monthButton" size="monthButton">
                  {month}
                </Button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="ml-2" />
        <CarouselNext className="border-primary color-primary mr-2" />
      </Carousel>

      <Carousel className="w-full">
        <CarouselContent className="mx-2 mr-4 lg:justify-center">
          {daysInMonth.map((date) => {
            if (date.dayName === "Sun") {
              return (
                <CarouselItem className="flex h-16 basis-1/7 items-center justify-center text-center lg:basis-1/31">
                  <Button variant="dayButtonSelected" size="dayButton">
                    <span className="font-bold">{date.dayDate}</span>
                    <span className="text-xs">{date.dayName}</span>
                  </Button>
                </CarouselItem>
              );
            } else {
              return (
                <CarouselItem className="flex h-16 basis-1/7 items-center justify-center text-center lg:basis-1/31">
                  <Button variant="dayButtonDefault" size="dayButton">
                    <span className="font-bold">{date.dayDate}</span>
                    <span className="text-xs">{date.dayName}</span>
                  </Button>
                </CarouselItem>
              );
            }
          })}
        </CarouselContent>
      </Carousel>

      <div className="w-full bg-red-500 lg:bg-blue-500 xl:bg-green-500">1</div>
    </nav>
  );
}
