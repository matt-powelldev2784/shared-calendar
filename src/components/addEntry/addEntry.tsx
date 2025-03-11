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
import { useQuery } from '@tanstack/react-query';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

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
      // ownerIds: [],
      // subscribers: [],
      // pendingRequests: [],
    },
  });

  console.log('form', form.formState.errors);

  if (!calendars || isLoading) {
    return <Loading classNames="mt-4 w-full mx-auto" />;
  }

  if (error) return <Error error={error as CustomError} />;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log('values', values);
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
          render={({ field }) => (
            <FormItem className="w-full max-w-[700px]">
              <FormLabel>Choose Calendar</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
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
            <FormItem className="m-4 w-full max-w-[700px]">
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
            <FormItem className="m-4 w-full max-w-[700px]">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="sm:gap:0 flex w-full max-w-[700px] flex-col items-center justify-between gap-4 sm:flex-row">
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
                        placeholder="Start Minute in 10 minute intervals"
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
                        placeholder="Start Minute in 10 minute intervals"
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
                        placeholder="Start Minute in 10 minute intervals"
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
                        placeholder="Start Minute in 10 minute intervals"
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

        <Button type="submit" className="m-4">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AddEntry;
