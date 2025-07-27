import { Link } from '@tanstack/react-router';
import SharcLogo from '@/assets/logo/sharc_logo_white.svg';
import SharcIcon from '@/assets/logo/sharc_icon_white.svg';
import { useEffect, useRef, useState, type JSX } from 'react';
import { NavIconButton } from './navIcon';
import { Bell, CalendarFold, CalendarPlus, LogOut } from 'lucide-react';
import { calendarMenuItem } from './userMenuItems';
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

  const emailName = authenticatedUser?.email?.split('@')[0];
  const emailNameWithUpperCase = emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : 'My';
  const testUserDisplayName = emailNameWithUpperCase.slice(0, 8) === 'Testuser' ? 'Demo User' : '';
  const displayName = testUserDisplayName || authenticatedUser?.displayName || emailNameWithUpperCase;

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
            <LogoWithCalendarName calendarName={`${displayName}'s Calendar`} />
          </div>

          <div className="mr-5 flex items-center gap-5">
            <Link
              to={'/add-entry'}
              className="item-center hidden h-9 w-full flex-row justify-center gap-2 rounded bg-blue-500 px-4 py-2 text-sm text-white transition hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none sm:flex"
              aria-label="Add Entry"
            >
              <CalendarPlus className="h-5 w-5" />
              Add Entry
            </Link>

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

            <Link to={'/signout'} aria-label="Sign Out">
              <LogOut className="h-6 w-6" />
            </Link>
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
    <div ref={menuRef} className="z-9999 flex items-center gap-5">
      <NavIconButton
        className={`${notificationCount > 0 ? 'h-8 w-8 cursor-pointer rounded-full bg-yellow-400' : 'cursor-pointer bg-none'}`}
        onClick={handleMenuClick}
        ariaLabel={menuIsOpen ? `Close ${menuName} menu` : `Open ${menuName} menu`}
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
          navigationItems.map((item) => <NavItem key={item.id} {...item} onClick={() => setMenuIsOpen(false)} />)}

        {menuIsOpen && navigationItems.length === 0 && (
          <NavItemPlaceholder id={menuName} text={`No ${menuName}s`} icon={icon} onClick={() => setMenuIsOpen(false)} />
        )}
      </ul>
    </div>
  );
};
