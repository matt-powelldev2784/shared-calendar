import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getCalendarEntries from "@/db/getCalendarEntries";
import type { CalendarEntry } from "@/ts/Calendar";
import { startOfDay, endOfDay } from "date-fns";

type FetchCalendarEntriesInput = {
  date: Date;
  calendarId: string;
  daysVisible: number;
};

const fetchCalendarEntries = async ({
  date,
  calendarId,
  daysVisible,
}: FetchCalendarEntriesInput): Promise<CalendarEntry[]> => {
  const startDate = startOfDay(date);
  const endDate = endOfDay(addDays(date, daysVisible - 1));
  return getCalendarEntries({
    calendarIds: [calendarId],
    startDate,
    endDate,
  });
};

export const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);
  const [daysVisible, setDaysVisible] = useState(7);
  const calendarId = "yw1klS3kMHGXHFHeqaJ4";

  const { data, error, isLoading } = useQuery({
    queryKey: ["calendarEntries", calendarId, date.toISOString(), daysVisible],
    queryFn: () => fetchCalendarEntries({ date, calendarId, daysVisible }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setIsSelectDateOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Popover open={isSelectDateOpen} onOpenChange={setIsSelectDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="datePicker" size="xl">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd MMMM yyyy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto">
          <Calendar
            mode="single"
            selected={date}
            onDateSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {data && data.length > 0 ? (
        data.map((entry: CalendarEntry) => (
          <div key={entry.id}>
            <h3>{entry.title}</h3>
            <p>{entry.description}</p>
            <p>{entry.dateTime.toString()}</p>
          </div>
        ))
      ) : (
        <div>No entries found.</div>
      )}
    </div>
  );
};
