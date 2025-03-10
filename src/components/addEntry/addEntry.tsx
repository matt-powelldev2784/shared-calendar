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

const formSchema = z.object({
  calendarId: z.string().nonempty(),
  title: z.string().nonempty(),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  ownerIds: z.array(z.string()).nonempty(),
  subscribers: z.array(z.string()),
  pendingRequests: z.array(z.string()),
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
      startDate: new Date(),
      endDate: new Date(),
      ownerIds: [],
      subscribers: [],
      pendingRequests: [],
    },
  });

  if (!calendars || isLoading) {
    return <Loading classNames="mt-4 w-full mx-auto" />;
  }

  if (error) return <Error error={error as CustomError} />;

  console.log('calendars', calendars);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
              <FormLabel className="ml-1">Choose Calendar</FormLabel>
              <FormControl>
                <Select>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AddEntry;
