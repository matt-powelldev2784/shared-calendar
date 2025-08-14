import { Link } from '@tanstack/react-router';
import SharcLogo from '@/assets/logo/sharc_logo_white.svg';
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

  const { data: authenticatedUser } = useQuery({
    queryKey: ['authenticatedUser'],
    queryFn: async () => await checkAuth(),
    // refetch data every 1 millisecond if there is no data
    // this is needed to get the data when the user first signs in
    refetchInterval: (data) => (!data ? false : 1),
  });

  return (
    <nav className="bg-primary flex h-16 w-full items-center text-white">
      {!authenticatedUser && (
        <img src={SharcLogo} alt="Sharc Calendar Logo" className={`ml-0 flex h-8 w-full md:ml-8 md:w-fit`} />
      )}

      {authenticatedUser && (
        <>
          <img src={SharcLogo} alt="Sharc Calendar Logo" className={`ml-8 hidden h-8 md:block`} />

          <div className="flex w-full flex-row items-center justify-evenly text-white md:mr-8 md:justify-end md:gap-8">
            <NavIconLink linkTo="/authenticated" aria-label="Add Entry">
              <Calendar className="h-7 w-7" />
            </NavIconLink>

            <NavIconLink linkTo="/add-entry" aria-label="Add Entry">
              <CalendarPlus className="h-7 w-7" />
            </NavIconLink>

            <DropDownMenu
              icon={<Bell className="h-7 w-7" />}
              menuName="Notification"
              navigationItems={requestMenuItems}
              notificationCount={numberOfRequests}
            />

            <NavIconLink linkTo="/signout" aria-label="Add Entry">
              <UserAvatar {...authenticatedUser} />
            </NavIconLink>
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
        className={`${notificationCount > 0 ? 'h-8 w-8 cursor-pointer rounded-full bg-yellow-400' : 'cursor-pointer bg-none'}`}
        onClick={handleMenuClick}
        ariaLabel={menuIsOpen ? `Close ${menuName} menu` : `Open ${menuName} menu`}
      >
        {icon}
      </NavIconButton>

      <ul
        className={
          menuIsOpen
            ? 'bg-primary fixed top-16 right-0 z-1200 max-h-[400px] w-[250px] overflow-y-auto duration-500 ease-in-out md:block'
            : 'fixed top-16 right-0 z-9999 max-h-0 w-[250px] overflow-y-auto duration-500 ease-in-out md:block'
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
    <Avatar className="relative flex min-h-8 min-w-8 -translate-x-0.5 items-center justify-center">
      {userAvatar && <AvatarImage className="bg-secondary absolute h-8 w-8 rounded-full" src={userAvatar} />}
      <AvatarFallback className="bg-secondary absolute h-8 w-8 text-xs">{oAuthUserInitials}</AvatarFallback>
    </Avatar>
  );
};
