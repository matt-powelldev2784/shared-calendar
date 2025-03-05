import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export const CalendarNavigation = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setIsSelectDateOpen(false);
  };

  return (
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
  );
};
