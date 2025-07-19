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
      startDate: setMinutes(setHours(addDays(monday, 0), 8), 0), // Monday 08:00
      endDate: setMinutes(setHours(addDays(monday, 0), 9), 0), // Monday 09:00
      calendarId,
      pendingRequests: [],
    },
    {
      title: 'https://matt-powelldev2784.github.io/founders_and_coders_feature_game/',
      description:
        'See my platform game project : Junior Dev Person is an 8-bit style game built with an endlessly scrolling background effect. It uses the requestAnimationFrame method to constantly update the DOM after each repaint. Game tokens are generated randomly and removed from the DOM once they have traveled across the screen. A backend built using NodeJS and Express is used to store the high scores. Touch detection logic is used to enable play on touch devices.',
      startDate: setMinutes(setHours(addDays(monday, 1), 9), 0), // Tuesday 09:00
      endDate: setMinutes(setHours(addDays(monday, 1), 9), 30), // Tuesday 09:30
      calendarId,
      pendingRequests: [],
    },
    {
      title: 'https://toytoystore.vercel.app/',
      description:
        'See Toy Shop Project projects: App built with NextJS, TypeScript, Sanity CMS, and Shopify. All Pages are server-side rendered using NextJS. Server actions are used to handle user interactions with the app. Some client side components are used at the edge of the tree for user interactivity. All Shopify data is fetched using the Shopify Storefront API using GraphQL queries. Sanity CMS is used to manage the promotional content in the app. End to end testing is implemented with Playwright.',
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
