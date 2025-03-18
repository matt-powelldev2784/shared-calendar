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
import Loading from '../ui/loading';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '../ui/input';
import { useNavigate } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { CalendarIcon } from 'lucide-react';
import addCalendar from '@/db/addCalendar';
import { getCalendarUrl } from '@/lib/getCalendarUrl';

export type AddCalendar = {
  name: string;
  description?: string;
  ownerIds?: string[];
  subscribers?: string[];
  pendingRequests?: string[];
};

const formSchema = z.object({
  name: z.string().nonempty({ message: 'Calendar name is required' }),
  description: z.string().optional(),
  calendarColor: z.string().optional(),
});

const AddCalendar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // submit calendar entry and navigate to calendar
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const calendarId = await addCalendar(values);

      if (calendarId) {
        queryClient.invalidateQueries({ queryKey: ['subscribedCalendars'] });
        const calendarUrl = getCalendarUrl({ calendarId });
        navigate({
          to: calendarUrl,
        });
      }

      return calendarId;
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      calendarColor: '',
    },
  });

  return (
    <Card className="mt-4 w-full max-w-[700px] border-0 p-0 shadow-none md:border md:p-4 md:shadow-sm">
      <CardHeader className="flex flex-col items-center">
        <CalendarIcon className="text-primary mr-2 inline-block h-12 w-12" />
        <CardTitle className="text-center">Add Calendar</CardTitle>
        <CardDescription className="text-center">
          Fill in the form below and click submit to add a calendar.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center p-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-5 w-full max-w-[700px]">
                  <FormLabel>Calendar Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Calendar Name" {...field} />
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
                  <FormLabel>Calendar Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Calendar Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="m-4 mt-10 w-full max-w-[700px]"
              size="lg"
            >
              {mutation.isPending ? <Loading variant="sm" /> : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddCalendar;
