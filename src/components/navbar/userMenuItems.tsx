import { Calendar, CirclePlus, LogOutIcon } from 'lucide-react';

export const userMenuItems = [
  {
    id: 1,
    text: 'Sign Out',
    route: '/signout',
    icon: <LogOutIcon className="mr-2 h-6 w-6" />,
  },
];

export const calendarMenuItem = [
  {
    id: 1,
    text: 'Add Entry',
    route: 'add-entry',
    icon: <CirclePlus className="mr-2 h-6 w-6" />,
  },
  {
    id: 2,
    text: 'View Calendar',
    route: '/authenticated',
    icon: <Calendar className="mr-2 h-6 w-6" />,
  },
];
