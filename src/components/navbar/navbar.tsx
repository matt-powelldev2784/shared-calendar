import { Link } from '@tanstack/react-router';
import SharcLogo from '@/assets/logo/sharc_logo_white.svg';
import { useEffect, useRef, useState, type JSX } from 'react';
import NavItem, { type NavItemProps } from './navItem';
import { NavIconButton } from './navIcon';
import { Bell, CalendarFold, CirclePlus } from 'lucide-react';
import UserAvatar from './userAvatar';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import { userMenuItems } from './userMenuItems';
import { useQuery } from '@tanstack/react-query';
import getSubscribedCalendars from '@/db/calendar/getSubscribedCalendars';
import getEntryRequests from '@/db/request/getEntryRequests';
import { getNumberOfRequests, setNumberOfRequests } from '@/store/store';

export const Navbar = () => {
  const [calendarName, setCalendarName] = useState('');
  const numberOfRequests = getNumberOfRequests();

  // get subscribed calendars data
  const { data: subscribedCalendars } = useQuery({
    queryKey: ['subscribedCalendars'],
    queryFn: async () => {
      const subscribedCalendars = await getSubscribedCalendars();
      setCalendarName(subscribedCalendars[0].name);
      return subscribedCalendars;
    },
    // refetch every 1 seconds if there is no subscribed calendars
    // this is used to get the data when a first time user signs in
    refetchInterval: (data) => (!data ? false : 1000),
  });

  // get requests data and store number of requests in global state
  const { data: requests } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const requests = await getEntryRequests();
      setNumberOfRequests(requests.length);
      return requests;
    },
    refetchInterval: 60 * 2 * 1000, // 2 mins
  });

  // generate subscribed calendar menu items
  const subscribedCalendarMenuItems = subscribedCalendars
    ? subscribedCalendars.map((calendar) => ({
        id: calendar.id,
        text: calendar.name,
        icon: <CalendarFold className="h-6 w-6" />,
        route: getCalendarUrl({ calendarIds: calendar.id }),
      }))
    : [];

  // generate request menu items
  const requestMenuItems = requests
    ? requests.map((request) => ({
        id: request.id,
        text: 'Calendar entry request',
        description: `${request.requesterEmail} wants you to add a calendar entry`,
        icon: <Bell className="h-6 w-6" />,
        route: `/review-pending-entry?entryId=${request.entryId}&requestId=${request.id}`,
        notificationCount: numberOfRequests,
      }))
    : [];

  return (
    <nav className="bg-primary z-1100 flex h-14 w-full items-center justify-between text-xl font-bold text-white md:h-12">
      {!subscribedCalendars && (
        <div className="flex flex-grow items-center justify-between">
          <Logo />
        </div>
      )}

      {subscribedCalendars && (
        <>
          <div className="flex flex-grow items-center">
            <LogoWithCalendarName calendarName={calendarName} />
          </div>

          <div className="mr-5 flex items-center gap-5">
            <DropDownMenu
              icon={<Bell className="h-6 w-6" />}
              menuName="Notification"
              navigationItems={requestMenuItems}
              notificationCount={numberOfRequests}
            />

            <DropDownMenu
              icon={<CalendarFold className="h-6 w-6" />}
              menuName={'Calendar'}
              navigationItems={subscribedCalendarMenuItems}
            />

            <DropDownMenu
              icon={<CirclePlus className="h-7 w-7" />}
              menuName="Add Items"
              navigationItems={userMenuItems}
            />
          </div>
        </>
      )}
    </nav>
  );
};

export const Logo = () => {
  return (
    <Link to="/" aria-label="Home" className="flex h-full items-center">
      <img src={SharcLogo} alt="sharc logo" className="ml-5 h-8" />
    </Link>
  );
};

type LogoWithCalendarNameProps = {
  calendarName: string;
};

const LogoWithCalendarName = ({ calendarName }: LogoWithCalendarNameProps) => {
  return (
    <Link to="/" aria-label="Home" className="ml-5 flex h-full items-center">
      <UserAvatar />
      <p
        style={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
        }}
        className="mr-1 flex h-full max-h-12 flex-wrap items-center justify-center overflow-hidden px-2 text-[15px]/4 sm:max-w-[400px] sm:text-[16px]/5"
      >
        {calendarName}
      </p>
    </Link>
  );
};

type DropDownMenuProps = {
  icon: JSX.Element;
  menuName: string;
  navigationItems: NavItemProps[];
  notificationCount?: number;
};

type PressOutsideEvent = MouseEvent | TouchEvent;

const DropDownMenu = ({
  icon,
  menuName,
  navigationItems,
  notificationCount = 0,
}: DropDownMenuProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setMenuIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!menuRef.current) return;

    const handleClickOutside = (event: PressOutsideEvent) => {
      const eventTarget = event.target as Node;

      if (!menuRef.current || !eventTarget) return;

      if (!menuRef.current.contains(eventTarget)) {
        setMenuIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuIsOpen(false);
      }
    };

    if (menuIsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuIsOpen]);

  return (
    <div ref={menuRef} className="flex items-center gap-5">
      <NavIconButton
        className={`${notificationCount > 0 ? 'h-8 w-8 rounded-full bg-yellow-400' : 'bg-none'}`}
        onClick={handleMenuClick}
        ariaLabel={
          menuIsOpen ? `Close ${menuName} menu` : `Open ${menuName} menu`
        }
      >
        {icon}
      </NavIconButton>
      <ul
        className={
          menuIsOpen
            ? 'bg-primary fixed top-12 right-0 z-1200 max-h-[400px] w-[250px] overflow-y-auto duration-500 ease-in-out md:block'
            : 'fixed top-12 right-0 z-9999 max-h-0 w-[250px] overflow-y-auto duration-500 ease-in-out md:block'
        }
      >
        {menuIsOpen &&
          navigationItems.map((item) => (
            <NavItem
              key={item.id}
              {...item}
              onClick={() => setMenuIsOpen(false)}
            />
          ))}

        {menuIsOpen && navigationItems.length === 0 && (
          <NavItem
            key={menuName}
            id={menuName}
            text={`No ${menuName}s`}
            icon={icon}
            onClick={() => setMenuIsOpen(false)}
            disabled={true}
          />
        )}
      </ul>
    </div>
  );
};
