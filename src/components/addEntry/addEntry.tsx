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
import { useMutation } from '@tanstack/react-query';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '../ui/customCalendar';
import { format } from 'date-fns';
import CalendarIcon from '../../assets/icons/cal_icon.svg';
import addCalendarEntry, {
  type AddCalendarEntry,
} from '@/db/entry/addCalendarEntry';
import { useNavigate } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { AtSign, CalendarPlusIcon, CircleX } from 'lucide-react';
import type { Calendar as CalenderT } from '@/ts/Calendar';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import getUserIdByEmail from '@/db/auth/getUserIdByEmail';
import { useState } from 'react';
import { hasDuplicates } from '@/lib/hasDuplicates';
import { CustomError } from '@/ts/errorClass';
import { getResponsiveStartDate } from '@/lib/getResponsiveStartDate';
import {
  FULL_DAYS_END_HOUR,
  FULL_DAYS_START_HOUR,
  OFFICE_END_HOUR,
  OFFICE_START_HOUR,
  smallScreenSize,
} from '@/lib/globalVariables';

const convertFormValuesToEntry = (values: z.infer<typeof formSchema>) => {
  const startDate = new Date(values.date);
  startDate.setHours(values.startTimeHour, Number(values.startTimeMins));

  const endDate = new Date(values.date);
  endDate.setHours(values.endTimeHour, Number(values.endTimeMins));

  const entry: AddCalendarEntry = {
    title: values.title,
    description: values.description,
    startDate,
    endDate,
    calendarId: values.calendarId,
    pendingRequests: values.pendingRequests,
  };

  return entry;
};

const formSchema = z.object({
  calendarId: z.string().nonempty({ message: 'Calendar is required' }),
  title: z.string().nonempty({ message: 'Title is required' }),
  description: z.string().optional(),
  startTimeHour: z.number().min(0).max(23, {
    message: 'Number between 0 and 23',
  }),
  startTimeMins: z.string().regex(/^(0[0-9]|[1-5][0-9])$/, {
    message: 'Start time minutes must be between 00 and 59',
  }),
  endTimeHour: z.number().min(0).max(23, {
    message: 'Number between 0 and 23',
  }),
  endTimeMins: z.string().regex(/^(0[0-9]|[1-5][0-9])$/, {
    message: 'End time minutes must be between 00 and 59',
  }),
  date: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: 'Date is required',
    }),
  addUser: z.string().email().or(z.literal('')).optional(),
  pendingRequests: z.array(z.string()).optional(),
  startDate: z.undefined(),
  endDate: z.undefined(),
  startAndEndTimeError: z.string().optional(),
});

type AddEntryProps = {
  calendars: CalenderT[];
};

type UserToRequest = {
  email: string;
  userId: string;
};

const AddEntry = ({ calendars }: AddEntryProps) => {
  const [usersToRequest, setUsersToRequest] = useState<UserToRequest[]>([]);
  const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);
  const navigate = useNavigate();
  const isSmallScreen = window.innerWidth < smallScreenSize;

  // submit calendar entry and navigate to calendar
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const entry = convertFormValuesToEntry(values);

      if (entry.startDate >= entry.endDate) {
        form.setError('startAndEndTimeError', {
          type: 'manual',
          message: 'Start time must be before end time',
        });
        return;
      }

      const calendarEntry = await addCalendarEntry(entry);
      const calendarId = values.calendarId;
      const entryIsExtendedHours = entry.startDate.getHours() < 8 || entry.endDate.getHours() > 17;

      if (calendarEntry) {
        const calendarUrl = getCalendarUrl({
          calendarIds: calendarId,
          startDate: getResponsiveStartDate(isSmallScreen, entry.startDate),
          startHour: entryIsExtendedHours ? FULL_DAYS_START_HOUR : OFFICE_START_HOUR,
          endHour: entryIsExtendedHours ? FULL_DAYS_END_HOUR : OFFICE_END_HOUR,
        });
        navigate({ to: calendarUrl });
        return calendarEntry;
      }
    },
    onError: (error: CustomError) => {
      navigate({
        to: `/error?status=${error.status}&message=${error.message}`,
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  // form initial values and custom errors variables
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calendarId: calendars[0].id,
      title: '',
      description: '',
      startTimeHour: 9,
      startTimeMins: '00',
      endTimeHour: 10,
      endTimeMins: '00',
      date: undefined,
      startDate: undefined,
      endDate: undefined,
      addUser: '',
      pendingRequests: [],
    },
  });
  const errors = form.formState.errors;
  const hasTimeError = [errors.startTimeHour, errors.startTimeMins, errors.endTimeHour, errors.endTimeMins].some(
    (error) => error !== undefined,
  );
  const startAndEndTimeError = errors.startAndEndTimeError?.message;

  const handleAddUser = async () => {
    const email = form.getValues('addUser');

    if (email) {
      try {
        const userId = await getUserIdByEmail(email);

        const userIdString = userId.toString();
        const currentRequests = form.getValues('pendingRequests') || [];
        const updatedRequests = [...currentRequests, userIdString];

        const userIdsHasDuplicates = hasDuplicates(updatedRequests);
        if (userIdsHasDuplicates) {
          form.setError('addUser', {
            type: 'manual',
            message: 'User already added',
          });
          return;
        }

        if (userIdString) {
          form.setValue('pendingRequests', [...currentRequests, userId]);
          form.setValue('addUser', '');
        }

        setUsersToRequest((prev) => [...prev, { email, userId }]);
      } catch (error) {
        console.error('Error getting user id: ', error);
        if (error instanceof CustomError) {
          form.setError('addUser', {
            type: 'manual',
            message: error.message,
          });
        }
      }
    }
  };

  const handleRemoveUser = (user: UserToRequest) => {
    const updatedUsers = form.getValues('pendingRequests')?.filter((request) => request !== user.userId);

    form.setValue('pendingRequests', updatedUsers);

    setUsersToRequest((prev) => prev.filter((requestedUser) => requestedUser.email !== user.email));
  };

  return (
    <Card className="my-8 mb-32 w-full max-w-[700px] border-0 p-0 shadow-none md:border md:p-4 md:shadow-sm">
      <CardHeader className="flex flex-col items-center">
        <CalendarPlusIcon className="text-primary mr-2 inline-block h-12 w-12" />
        <CardTitle className="text-center">Add Calendar Entry</CardTitle>
        <CardDescription className="text-center">
          Fill in the form below and click submit to add a calendar entry.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center p-4">
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
                  <FormLabel>Description (optional)</FormLabel>
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
                  <Popover open={isSelectDateOpen} onOpenChange={setIsSelectDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outlineThin" size="sm" className="w-full border-zinc-200">
                          <img src={CalendarIcon} alt="calendar" className="-w-5 mr-2 h-5" />
                          {form.getValues('date') ? format(form.getValues('date'), 'dd MMMM yyyy') : 'Pick a date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date('1900-01-01')}
                        onDateSelect={() => setIsSelectDateOpen(false)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-destructive-foreground absolute top-16 -translate-x-0.5 -translate-y-3 text-sm" />
                </FormItem>
              )}
            />

            <div className="relative mt-3 flex w-full max-w-[700px] flex-col items-center justify-between gap-4 md:flex-row md:gap-10">
              <div className="flex w-full flex-grow flex-col">
                <FormLabel className="mb-2">Start Time</FormLabel>
                <div className="flex flex-row">
                  <FormField
                    control={form.control}
                    name="startTimeHour"
                    render={({ field }) => (
                      <FormItem className="m-0 max-w-[700px] min-w-26 flex-grow">
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
                            onFocus={() => form.clearErrors('startAndEndTimeError')}
                          />
                        </FormControl>
                        <FormMessage className="sr-only" />
                      </FormItem>
                    )}
                  />

                  <p className="mx-2 translate-y-0.5 text-xl font-bold">:</p>

                  <FormField
                    control={form.control}
                    name="startTimeMins"
                    render={({ field }) => (
                      <FormItem className="m-0 max-w-[700px] flex-grow">
                        <FormLabel className="sr-only">Start time in minutes</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Minutes 2 Digits"
                            className="text-center"
                            type="text"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            style={{
                              WebkitAppearance: 'none',
                              MozAppearance: 'textfield',
                            }}
                            onFocus={() => form.clearErrors('startAndEndTimeError')}
                          />
                        </FormControl>
                        <FormMessage className="sr-only" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex w-full flex-grow flex-col">
                <FormLabel className="mb-2">End Time</FormLabel>
                <div className="flex flex-row">
                  <FormField
                    control={form.control}
                    name="endTimeHour"
                    render={({ field }) => (
                      <FormItem className="m-0 max-w-[700px] min-w-26 flex-grow">
                        <FormLabel className="sr-only">Start Hour</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="End Hour"
                            className="text-center"
                            type="number"
                            min="0"
                            max="23"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            onFocus={() => form.clearErrors('startAndEndTimeError')}
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
                    name="endTimeMins"
                    render={({ field }) => (
                      <FormItem className="m-0 max-w-[700px] flex-grow">
                        <FormLabel className="sr-only">End time in minutes</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Minutes 2 Digits"
                            className="text-center"
                            type="text"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            onFocus={() => form.clearErrors('startAndEndTimeError')}
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

              {/* Display error if any of the 4 time inputs are invalid */}
              {hasTimeError && (
                <p className="absolute w-full max-w-[700px] translate-y-33 rounded-md px-2 text-center text-sm leading-tight text-red-500 md:translate-y-10">
                  Hours must be between 0 and 23 and minutes must be between 00 and 59.
                </p>
              )}

              {/* Display error if combination of start and end times are invalid */}
              {startAndEndTimeError && (
                <p className="absolute w-full max-w-[700px] translate-y-33 rounded-md px-2 text-center text-sm text-red-500 md:translate-y-10">
                  Start time must be before end time
                </p>
              )}
            </div>

            <div className="border-secondary25 mt-4 flex w-full max-w-[700px] flex-col items-center justify-between gap-2 rounded-lg pb-4 md:mt-6 md:gap-4 md:border-1 md:px-6 md:py-3">
              <div className="border-secondary/50 mt-5 w-full border-2 md:hidden"></div>

              <div className="mt-4 flex w-full max-w-[700px] flex-col items-center justify-between md:flex-row md:gap-4">
                <FormField
                  control={form.control}
                  name="addUser"
                  render={({ field }) => (
                    <FormItem className="mt-0 w-full max-w-[700px]">
                      <FormLabel>Share Request With (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email address of user"
                          {...field}
                          onFocus={() => form.clearErrors('addUser')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="bg-secondary hover:bg-secondary md:md-2 mt-3 w-full max-w-[700px] md:mt-3 md:h-9 md:w-12"
                  size="lg"
                  onClick={handleAddUser}
                  type="button"
                >
                  Add User
                </Button>
              </div>

              {usersToRequest.length > 0 && (
                <div className="relative mt-4 flex w-full flex-col">
                  <ul className="flex flex-wrap items-center justify-center gap-2">
                    {usersToRequest.map((user) => (
                      <li
                        key={user.email}
                        className="border-secondary/25 text-secondary flex w-full flex-grow items-center justify-between gap-2 rounded-md border-1 px-4 py-1"
                      >
                        <AtSign />
                        <p className="w-full truncate text-center text-xs sm:text-sm">{user.email}</p>
                        <button className="text-destructive px-2 font-bold" onClick={() => handleRemoveUser(user)}>
                          <CircleX />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-secondary/50 mt-5 w-full border-2 md:hidden"></div>

            <Button type="submit" className="mt-8 w-full max-w-[700px]" size="lg">
              {mutation.isPending ? <Loading variant="sm" /> : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddEntry;
