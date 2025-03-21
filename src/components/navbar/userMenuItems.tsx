import { Bell, CalendarPlus2, LogOutIcon, UsersIcon } from 'lucide-react';

export const userMenuItems = [
  {
    id: 1,
    text: 'Notifications',
    route: '/',
    icon: <Bell className="mr-2 h-6 w-6" />,
  },
  {
    id: 2,
    text: 'Share Calendar',
    description:
      'Share a calendar with other users to view shared calendar entries in a single view.',
    route: '/',
    icon: <UsersIcon className="mr-2 h-6 w-6" />,
  },
  {
    id: 3,
    text: 'Add Calendar',
    route: '/add-calendar',
    icon: <CalendarPlus2 className="mr-2 h-6 w-6" />,
  },
  {
    id: 4,
    text: 'Sign Out',
    route: '/signout',
    icon: <LogOutIcon className="mr-2 h-6 w-6" />,
  },
];
