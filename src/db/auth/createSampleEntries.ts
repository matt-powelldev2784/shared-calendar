import addCalendarEntry from '@/db/entry/addCalendarEntry';
import { startOfWeek, addDays, setHours, setMinutes } from 'date-fns';

export const createSampleEntires = async (calendarId: string) => {
  const now = new Date();
  // Get Monday of the current week
  const monday = startOfWeek(now, { weekStartsOn: 1 });

  const sampleEntries = [
    {
      title: 'Sample Entry',
      description: '',
      startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0), // Today 08:00
      endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0), // Today 09:00
      calendarId,
      pendingRequests: [],
    },
    {
      title: 'https://matthew-powell-dev.com/',
      description: 'See my website!',
      startDate: setMinutes(setHours(addDays(monday, 1), 11), 0), // Tuesday 11:00
      endDate: setMinutes(setHours(addDays(monday, 1), 11), 45), // Tuesday 11:45
      calendarId,
      pendingRequests: [],
    },
    {
      title: 'https://toytoystore.vercel.app/',
      description:
        'See my Toy Shop Project: App built with NextJS, TypeScript, Sanity CMS, and Shopify. All Pages are server-side rendered using NextJS. Server actions are used to handle user interactions with the app. Some client side components are used at the edge of the tree for user interactivity. All Shopify data is fetched using the Shopify Storefront API using GraphQL queries. Sanity CMS is used to manage the promotional content in the app. End to end testing is implemented with Playwright.',
      startDate: setMinutes(setHours(addDays(monday, 2), 8), 0), // Wednesday 08:00
      endDate: setMinutes(setHours(addDays(monday, 2), 9), 30), // Wednesday 09:30
      calendarId,
      pendingRequests: [],
    },
    {
      title: 'https://curry-shop.vercel.app/',
      description:
        'See my food take away project: A food takeaway application built to explore the main features of NextJS. Built with NextJS, Sanity CMS, TypeScript, Postgres, Prisma and TailwindCSS. The site utilises NextJS features for SSR, ISR, API creation, dynamic routes, and image optimisation. Menu items can be added, edited and deleted using the Sanity CMS. User authentication implemented with Next-Auth. Payment gateway integrated using Stripe.',
      startDate: setMinutes(setHours(addDays(monday, 3), 10), 0), // Thursday 10:00
      endDate: setMinutes(setHours(addDays(monday, 3), 10), 30), // Thursday 10:30
      calendarId,
      pendingRequests: [],
    },
  ];

  for (const entry of sampleEntries) {
    await addCalendarEntry(entry);
  }
};
