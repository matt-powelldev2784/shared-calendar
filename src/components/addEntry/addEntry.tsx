import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import getSubscribedCalendars from '@/db/getSubscribedCalendars';
import Loading from '../ui/loading';
import Error from '../ui/error';
import type { CustomError } from '@/ts/errorClass';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import CalendarIcon from '../../assets/icons/cal_icon.svg';
import addCalendarEntry, { type AddCalendarEntry } from '@/db/addCalendarEntry';

const convertFormValuesToEntry = (values: z.infer<typeof formSchema>) => {
  const startDateMinutes = parseInt(
    values.startDateTenMinIntervals.toString() +
      values.startDateOneMinIntervals.toString(),
  );

  const endDateMinutes = Number(
    values.endDateTenMinIntervals.toString() +
      values.endDateOneMinIntervals.toString(),
  );

  const startDate = new Date(values.date);
  startDate.setHours(values.startDateHour, startDateMinutes);

  const endDate = new Date(values.date);
  endDate.setHours(values.endDateHour, endDateMinutes);

  const updatedEntry: AddCalendarEntry = {
    title: values.title,
    description: values.description,
    startDate,
    endDate,
    calendarId: values.calendarId,
  };

  return updatedEntry;
};

const formSchema = z.object({
  calendarId: z.string().nonempty(),
  title: z.string().nonempty(),
  description: z.string().optional(),
  startDateHour: z.number().min(0).max(23),
  startDateTenMinIntervals: z.number().min(0).max(5),
  startDateOneMinIntervals: z.number().min(0).max(9),
  endDateHour: z.number().min(0).max(23),
  endDateTenMinIntervals: z.number().min(0).max(5),
  endDateOneMinIntervals: z.number().min(0).max(9),
  date: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: 'Date is required',
    }),
  startDate: z.undefined(),
  endDate: z.undefined(),
  // ownerIds: z.array(z.string()).nonempty(),
  // subscribers: z.array(z.string()),
  // pendingRequests: z.array(z.string()),
});

const AddEntry = () => {
  const {
    data: calendars,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['getSubscribedCalendars'],
    queryFn: async () => await getSubscribedCalendars(),
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const entry = convertFormValuesToEntry(values);
      return await addCalendarEntry(entry);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calendarId: '',
      title: '',
      description: '',
      startDateHour: 9,
      startDateTenMinIntervals: 0,
      startDateOneMinIntervals: 0,
      endDateHour: 10,
      endDateTenMinIntervals: 0,
      endDateOneMinIntervals: 0,
      date: undefined,
      startDate: undefined,
      endDate: undefined,
      // ownerIds: [],
      // subscribers: [],
      // pendingRequests: [],
    },
  });

  if (!calendars || isLoading) {
    return <Loading classNames="mt-4 w-full mx-auto" />;
  }

  if (error) return <Error error={error as CustomError} />;
  if (mutation.isError) return <Error error={mutation.error as CustomError} />;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center p-4"
      >
        <FormField
          control={form.control}
          name="calendarId"
          render={({ field, fieldState }) => (
            <FormItem className="w-full max-w-[700px]">
              <FormLabel>Choose Calendar</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    aria-invalid={!!fieldState.error}
                    className="w-full"
                  >
                    <SelectValue placeholder="Choose Calendar" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map((calendar) => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        {calendar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="mt-5 w-full max-w-[700px]">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mt-5 w-full max-w-[700px]">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="w-full max-w-[700px]">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outlineThin"
                      size="sm"
                      className="w-full border-zinc-200"
                    >
                      <img
                        src={CalendarIcon}
                        alt="calendar"
                        className="-w-5 mr-2 h-5"
                      />
                      {form.getValues('date')
                        ? format(form.getValues('date'), 'dd MMMM yyyy')
                        : 'Pick a date'}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-destructive-foreground absolute top-16 -translate-x-0.5 -translate-y-3 text-sm" />
            </FormItem>
          )}
        />

        <div className="sm:gap:0 mt-3 flex w-full max-w-[700px] flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="max-w-screen sm:max-w-none">
            <FormLabel className="mb-2 pl-4 sm:pl-0">Start Time</FormLabel>
            <div className="flex w-full max-w-screen flex-row px-4 sm:px-0">
              <FormField
                control={form.control}
                name="startDateHour"
                render={({ field }) => (
                  <FormItem className="m-0 w-48 max-w-[700px] sm:w-20">
                    <FormLabel className="sr-only">Start Hour</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Start Hour"
                        className="text-center"
                        type="number"
                        min="0"
                        max="23"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield',
                        }}
                      />
                    </FormControl>
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />
              <p className="mx-2 translate-y-0.5 text-xl font-bold">:</p>

              <FormField
                control={form.control}
                name="startDateTenMinIntervals"
                render={({ field }) => (
                  <FormItem className="m-0 w-48 max-w-[700px] sm:w-20">
                    <FormLabel className="sr-only">
                      Start Minute in 10 minute intervals
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Start Minute 1"
                        className="text-center"
                        type="number"
                        min="0"
                        max="5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield',
                        }}
                      />
                    </FormControl>
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDateOneMinIntervals"
                render={({ field }) => (
                  <FormItem className="m-0 w-48 max-w-[700px] sm:w-20">
                    <FormLabel className="sr-only">
                      Start Minute in 10 minute intervals
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Start Minute 2"
                        className="text-center"
                        type="number"
                        min="0"
                        max="5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield',
                        }}
                      />
                    </FormControl>
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="max-w-screen">
            <FormLabel className="mb-2 pl-4 sm:pl-0">End Time</FormLabel>
            <div className="flex w-full max-w-screen flex-row px-4 sm:px-0">
              <FormField
                control={form.control}
                name="endDateHour"
                render={({ field }) => (
                  <FormItem className="m-0 w-48 max-w-[700px] sm:w-20">
                    <FormLabel className="sr-only">Start Hour</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Start Hour"
                        className="text-center"
                        type="number"
                        min="0"
                        max="23"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield',
                        }}
                      />
                    </FormControl>
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />
              <p className="mx-2 translate-y-0.5 text-xl font-bold">:</p>

              <FormField
                control={form.control}
                name="endDateTenMinIntervals"
                render={({ field }) => (
                  <FormItem className="m-0 w-48 max-w-[700px] sm:w-20">
                    <FormLabel className="sr-only">
                      Start Minute in 10 minute intervals
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Start Minute 1"
                        className="text-center"
                        type="number"
                        min="0"
                        max="5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield',
                        }}
                      />
                    </FormControl>
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDateOneMinIntervals"
                render={({ field }) => (
                  <FormItem className="m-0 w-48 max-w-[700px] sm:w-20">
                    <FormLabel className="sr-only">
                      Start Minute in 10 minute intervals
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Start Minute 2"
                        className="text-center"
                        type="number"
                        min="0"
                        max="5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield',
                        }}
                      />
                    </FormControl>
                    <FormMessage className="sr-only" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="m-4 mt-8" size="lg">
          {mutation.isPending ? <Loading variant="sm" /> : 'Submit'}
        </Button>
      </form>
    </Form>
  );
};

export default AddEntry;
