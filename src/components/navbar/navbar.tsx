import { Link } from '@tanstack/react-router';
import SharcLogo from '@/assets/logo/sharc_logo_white.svg';
import SharcIcon from '@/assets/logo/sharc_icon_white.svg';
import { useEffect, useRef, useState, type JSX } from 'react';
import NavItem, { type NavItemProps } from './navItem';
import { NavIconButton, NavIconLink } from './navIcon';
import { CalendarFold, CalendarPlusIcon } from 'lucide-react';
import UserAvatar from './userAvatar';
import { getCalendarUrl } from '@/lib/getCalendarUrl';
import { userMenuItems } from './userMenuItems';
import { useQuery } from '@tanstack/react-query';
import getSubscribedCalendars from '@/db/getSubscribedCalendars';

export const Navbar = () => {
  const [calendarName, setCalendarName] = useState('');

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

  // generate subscribed calendar menu items
  const subscribedCalendarMenuItems = subscribedCalendars
    ? subscribedCalendars.map((calendar) => ({
        id: calendar.id,
        text: calendar.name,
        icon: <CalendarFold className="h-6 w-6" />,
        route: getCalendarUrl({ calendarIds: calendar.id }),
      }))
    : [];

  return (
    <nav className="bg-primary z-1100 flex h-14 w-full items-center justify-between text-xl font-bold text-white md:h-12">
      {!subscribedCalendars && (
        <div className="flex flex-grow items-center">
          <Logo />
        </div>
      )}

      {subscribedCalendars && (
        <>
          <div className="flex flex-grow items-center">
            <LogoWithCalendarName calendarName={calendarName} />
          </div>
          <div className="mr-5 flex items-center gap-5">
            <NavIconLink linkTo="/add-entry" ariaLabel="Go to add entry page">
              <CalendarPlusIcon className="h-6 w-6" />
            </NavIconLink>

            <DropDownMenu
              icon={<CalendarFold className="h-6 w-6" />}
              label={{
                openText: 'Open Calendar Menu',
                closeText: 'Close Calendar Menu',
              }}
              navigationItems={subscribedCalendarMenuItems}
            />

            <DropDownMenu
              icon={<UserAvatar />}
              label={{
                openText: 'Open User Menu',
                closeText: 'Close User Menu',
              }}
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
    <Link to="/" aria-label="Home" className="flex h-full items-center">
      <img src={SharcIcon} alt="sharc logo" className="ml-5 h-8" />
      <p
        style={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
        }}
        className="mr-3 flex h-full max-h-12 flex-wrap items-center justify-center overflow-hidden px-2 text-[15px]/4 font-normal sm:max-w-[400px] sm:text-[16px]/5"
      >
        {calendarName}
      </p>
    </Link>
  );
};

type DropDownMenuProps = {
  icon: JSX.Element;
  label: {
    openText: string;
    closeText: string;
  };
  navigationItems: NavItemProps[];
};

type PressOutsideEvent = MouseEvent | TouchEvent;

const DropDownMenu = ({ icon, label, navigationItems }: DropDownMenuProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { openText, closeText } = label;

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
        onClick={handleMenuClick}
        ariaLabel={menuIsOpen ? closeText : openText}
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
      </ul>
    </div>
  );
};
