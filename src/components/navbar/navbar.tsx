import { Link, useLocation } from '@tanstack/react-router';
import SharcLogo from '@/assets/logo/sharc_logo_blue.svg';
import SharcIcon from '@/assets/logo/sharc_icon_white.svg';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { NavIconButton, NavIconLink } from './navIcon';
import { Bell, Calendar, CalendarPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import checkAuth from '@/db/auth/checkAuth';
import { NavItem, NavItemPlaceholder, type NavItemProps } from './navItem';
import { useRequestMenuItems } from './useRequestMenuItems';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type User } from 'firebase/auth';

export const Navbar = () => {
  const { requestMenuItems, numberOfRequests } = useRequestMenuItems();
  const location = useLocation();
  const pathname = location.pathname;

  const { data: authenticatedUser } = useQuery({
    queryKey: ['authenticatedUser'],
    queryFn: async () => await checkAuth(),
    // refetch data every 1 millisecond if there is no data
    // this is needed to get the data when the user first signs in
    refetchInterval: (data) => (!data ? false : 1),
  });

  return (
    <nav className="relative flex h-14 w-full items-center md:h-16">
      {!authenticatedUser && (
        <img src={SharcLogo} alt="Sharc Calendar Logo" className={`ml-0 flex h-8 w-full md:ml-8 md:w-fit`} />
      )}

      {authenticatedUser && (
        <>
          <img src={SharcLogo} alt="Sharc Calendar Logo" className={`ml-8 hidden h-8 md:block`} />
          <div className="bg-primary flex h-14 w-18 items-center justify-center md:hidden">
            <img src={SharcIcon} alt="Sharc Calendar Logo" className="block h-7 md:hidden" />
          </div>

          <div className="text-primary mr-0 flex h-full w-full flex-row items-center justify-evenly md:mr-4 md:justify-end md:gap-8">
            <NavIconLink
              linkTo="/authenticated"
              aria-label="View Calendar"
              desktopIcon={<Calendar className="h-5 w-5" />}
              mobileIcon={<Calendar className="h-7 w-7" />}
              text="Calendar"
              isActive={pathname === '/get-calendar'}
            />

            <NavIconLink
              linkTo="/add-entry"
              aria-label="Add Entry"
              desktopIcon={<CalendarPlus className="h-5 w-5" />}
              mobileIcon={<CalendarPlus className="h-7 w-7" />}
              text="Add Entry"
              isActive={pathname === '/add-entry'}
            />

            <DropDownMenu
              icon={<Bell className="h-6 w-6" />}
              menuName="Notifications"
              navigationItems={requestMenuItems}
              notificationCount={numberOfRequests}
            />

            <NavIconLink
              linkTo="/signout"
              aria-label="Sign Out"
              desktopIcon={<UserAvatar {...authenticatedUser} />}
              mobileIcon={<UserAvatar {...authenticatedUser} />}
              className="px-0"
            />
          </div>
        </>
      )}
    </nav>
  );
};

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" aria-label="Home" className="flex h-full items-center">
      <img src={SharcLogo} alt="Sharc Calendar Logo" className={`ml-5 hidden h-8 md:block ${className}`} />
      <img src={SharcIcon} alt="Sharc Calendar Logo" className={`ml-5 block h-8 md:hidden ${className}`} />
    </Link>
  );
};

type DropDownMenuProps = {
  icon: ReactElement;
  menuName: string;
  navigationItems: NavItemProps[];
  notificationCount?: number;
};

type PressOutsideEvent = MouseEvent | TouchEvent;

const DropDownMenu = ({ icon, menuName, navigationItems, notificationCount = 0 }: DropDownMenuProps) => {
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
        onClick={handleMenuClick}
        icon={icon}
        aria-label={menuIsOpen ? `Close ${menuName} menu` : `Open ${menuName} menu`}
        className={`rounded-lg border-2 p-1 ${notificationCount > 0 ? 'border-primary text-primary bg-yellow-300' : 'border-secondary text-secondary bg-none'}`}
      />

      <ul
        className={`border-secondary fixed top-15 right-0 left-0 z-[9999] mx-4 scroll-auto rounded-lg border-1 bg-white shadow-lg transition-all duration-500 ease-in-out md:top-16 md:right-4 md:left-auto md:mx-0 md:w-[300px] ${
          menuIsOpen
            ? 'visible max-h-[400px] overflow-y-auto opacity-100'
            : 'invisible max-h-0 overflow-hidden opacity-0'
        } `}
      >
        <p className="bg-primary w-full p-2 text-center font-bold text-white">Notifications</p>

        {menuIsOpen &&
          navigationItems.map((item) => <NavItem key={item.id} {...item} onClick={() => setMenuIsOpen(false)} />)}

        {menuIsOpen && navigationItems.length === 0 && (
          <NavItemPlaceholder id={menuName} text={`No ${menuName}`} icon={icon} onClick={() => setMenuIsOpen(false)} />
        )}
      </ul>
    </div>
  );
};

const UserAvatar = (user: User) => {
  const emailName = user?.email?.split('@')[0];
  const emailNameWithUpperCase = emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : 'My';
  const testUserDisplayName = emailNameWithUpperCase.slice(0, 8) === 'Testuser' ? 'Demo User' : '';
  const displayName = testUserDisplayName || user?.displayName || emailNameWithUpperCase;

  const oAuthUserInitials = displayName
    ?.split(' ')
    .map((name) => name[0].slice(0))
    .join('');
  const userAvatar = user?.photoURL;

  return (
    <Avatar className="relative flex h-10 w-10 -translate-x-0.5 items-center justify-center" aria-label="User Settings">
      {userAvatar && <AvatarImage className="absolute h-10 w-10 rounded-full" src={userAvatar} />}
      <AvatarFallback className="border-secondary text-secondary absolute h-10 w-10 border-2 text-sm">
        {oAuthUserInitials}
      </AvatarFallback>
    </Avatar>
  );
};
