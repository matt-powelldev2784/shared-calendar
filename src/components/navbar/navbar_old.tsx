import sharcLogoWhite from '../../assets/logo/sharc_logo_white.svg';
import {
  Bell,
  CalendarFold,
  Calendar as CalendarIcon,
  CalendarPlus2 as CalenderPlus2Icon,
} from 'lucide-react';
import { LogOut as LogOutIcon } from 'lucide-react';
import { Users as UsersIcon } from 'lucide-react';
import { CalendarPlus as CalendarPlusIcon } from 'lucide-react';
import { lazy, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { NavIconButton, NavIconLink } from './navIcon';
import NavItem from './navItem';
import { useQuery } from '@tanstack/react-query';
import getSubscribedCalendars from '@/db/calendar/getSubscribedCalendars';
import { getCalendarUrl } from '@/lib/getCalendarUrl';

// firebase auth uses over 300kb of data
// lazy loading the UserAvatar component will reduce the initial bundle size
const UserAvatar = lazy(() => import('./userAvatar'));

const userMenuItems = [
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
    icon: <CalenderPlus2Icon className="mr-2 h-6 w-6" />,
  },
  {
    id: 4,
    text: 'Sign Out',
    route: '/signout',
    icon: <LogOutIcon className="mr-2 h-6 w-6" />,
  },
];

export const Navbar = () => {
  const [calendarMenuIsOpen, setCalendarMenuIsOpen] = useState(false);
  const [userMenuIsOpen, setUserMenuIsOpen] = useState(false);

  // get subscribed calendars data
  const { data } = useQuery({
    queryKey: ['subscribedCalendars'],
    queryFn: async () => await getSubscribedCalendars(),
  });

  // map calendars for calendar menu
  const calendars = data
    ? data.map((calendar) => ({
        id: calendar.id,
        text: calendar.name,
        route: getCalendarUrl({ calendarIds: calendar.id }),
        icon: <CalendarIcon className="mr-2 h-6 w-6" />,
        onClick: () => setCalendarMenuIsOpen((prev) => !prev),
      }))
    : [];

  // handle the closing of menus when clicking outside of current the menu
  useEffect(() => {
    const handleCloseMenus = () => {
      if (userMenuIsOpen) setUserMenuIsOpen(false);
      if (calendarMenuIsOpen) setCalendarMenuIsOpen(false);
    };

    window.addEventListener('click', handleCloseMenus);
    window.addEventListener('keydown', handleCloseMenus);
    window.addEventListener('scroll', handleCloseMenus);
    window.addEventListener('resize', handleCloseMenus);
    window.addEventListener('touch', handleCloseMenus);

    return () => {
      window.removeEventListener('click', handleCloseMenus);
      window.removeEventListener('keydown', handleCloseMenus);
      window.removeEventListener('scroll', handleCloseMenus);
      window.removeEventListener('resize', handleCloseMenus);
      window.removeEventListener('touch', handleCloseMenus);
    };
  }, [calendarMenuIsOpen, userMenuIsOpen]);

  const handleCalendarMenuClick = (event: MouseEvent) => {
    event.stopPropagation();
    setUserMenuIsOpen(false);
    setCalendarMenuIsOpen((prev) => !prev);
  };

  const handleUserMenuClick = (event: MouseEvent) => {
    event.stopPropagation();
    setCalendarMenuIsOpen(false);
    setUserMenuIsOpen((prev) => !prev);
  };

  return (
    <nav className="bg-primary z-1100 flex h-14 w-full items-center justify-between text-xl font-bold text-white md:h-12">
      <Link to="/" aria-label="Home">
        <img src={sharcLogoWhite} alt="sharc logo" className="ml-5 h-8" />
      </Link>

      {/**************** Main Navigation Icons *****************/}
      <div
        className={`mr-5 flex items-center gap-5 ${data ? 'md:flex' : 'md:hidden'}`}
      >
        <NavIconLink linkTo="/add-entry" ariaLabel="Go to add entry page">
          <CalendarPlusIcon className="h-6 w-6" />
        </NavIconLink>

        <NavIconButton
          onClick={handleCalendarMenuClick}
          ariaLabel={
            calendarMenuIsOpen ? 'Close calendar menu' : 'Open calendar menu'
          }
        >
          <CalendarFold className="h-6 w-6" />
        </NavIconButton>

        <NavIconButton
          onClick={handleUserMenuClick}
          ariaLabel={userMenuIsOpen ? 'Close user menu' : 'Open user menu'}
        >
          <UserAvatar />
        </NavIconButton>
      </div>

      {/**************** Calendar Navigation Menu *****************/}
      <ul
        className={
          calendarMenuIsOpen
            ? 'bg-primary fixed top-12 right-0 z-1200 max-h-[400px] w-[250px] overflow-y-auto duration-500 ease-in-out md:block'
            : 'fixed top-12 right-0 z-9999 max-h-0 w-[250px] overflow-y-auto duration-500 ease-in-out md:block'
        }
      >
        {calendarMenuIsOpen &&
          calendars &&
          calendars.map((calendar) => {
            return (
              <NavItem
                key={calendar.id}
                {...calendar}
                onClick={handleCalendarMenuClick}
              />
            );
          })}
      </ul>

      {/**************** User Navigation Menu *****************/}
      <ul
        className={
          userMenuIsOpen
            ? 'bg-primary fixed top-12 right-0 z-1200 max-h-[400px] w-[250px] overflow-y-auto duration-500 ease-in-out md:block'
            : 'fixed top-12 right-0 z-9999 max-h-0 w-[250px] overflow-y-auto duration-500 ease-in-out md:block'
        }
      >
        {userMenuIsOpen &&
          userMenuItems.map((item) => (
            <NavItem key={item.id} {...item} onClick={handleUserMenuClick} />
          ))}
      </ul>
    </nav>
  );
};
