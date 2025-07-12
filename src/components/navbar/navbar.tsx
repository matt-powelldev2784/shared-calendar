import { Link } from '@tanstack/react-router';
import SharcLogo from '@/assets/logo/sharc_logo_white.svg';
import SharcIcon from '@/assets/logo/sharc_icon_white.svg';
import { useEffect, useRef, useState, type JSX } from 'react';
import { NavIconButton } from './navIcon';
import { Bell, CalendarFold } from 'lucide-react';
import UserAvatar from './userAvatar';
import { calendarMenuItem, userMenuItems } from './userMenuItems';
import { useQuery } from '@tanstack/react-query';
import checkAuth from '@/db/auth/checkAuth';
import { NavItem, NavItemPlaceholder, type NavItemProps } from './navItem';
import { useRequestMenuItems } from './useRequestMenuItems';

export const Navbar = () => {
  const { requestMenuItems, numberOfRequests } = useRequestMenuItems();

  const { data: authenticatedUser } = useQuery({
    queryKey: ['authenticatedUser'],
    queryFn: async () => await checkAuth(),
    // refetch data every 1 millisecond if there is no data
    // this is needed to get the data when the user first signs in
    refetchInterval: (data) => (!data ? false : 1),
  });

  return (
    <nav className="bg-primary z-1100 flex h-14 w-full items-center justify-between text-xl font-bold text-white md:h-12">
      {!authenticatedUser && (
        <div className="flex flex-grow items-center justify-between">
          <Logo />
        </div>
      )}

      {authenticatedUser && (
        <>
          <div className="flex flex-grow items-center">
            <LogoWithCalendarName
              calendarName={`${authenticatedUser.displayName}'s Calendar`}
            />
          </div>

          <div className="mr-5 flex items-center gap-5">
            <DropDownMenu
              icon={<CalendarFold className="h-6 w-6" />}
              menuName="Calendar Menu Items"
              navigationItems={calendarMenuItem}
            />

            <DropDownMenu
              icon={<Bell className="h-6 w-6" />}
              menuName="Notification"
              navigationItems={requestMenuItems}
              notificationCount={numberOfRequests}
            />

            <DropDownMenu
              icon={<UserAvatar />}
              menuName="User Menu Items"
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
      <img src={SharcIcon} alt="sharc logo" className="h-8" />
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

  // logic to close the menu when the user clicks outside of it
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
          <NavItemPlaceholder
            id={menuName}
            text={`No ${menuName}s`}
            icon={icon}
            onClick={() => setMenuIsOpen(false)}
          />
        )}
      </ul>
    </div>
  );
};
