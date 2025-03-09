import sharcLogoWhite from "../../assets/logo/sharc_logo_white.svg";
import crossIconWhite from "../../assets/icons/cross_white.svg";
import nineDotsIcon from "../../assets/icons/nine_dots.svg";
import { Calendar as CalendarIcon } from "lucide-react";
import { LogOut as LogOutIcon } from "lucide-react";
import { Users as UsersIcon } from "lucide-react";
import { CalendarPlus as CalendarPlusIcon } from "lucide-react";
import { lazy, useState } from 'react';
import { Link } from '@tanstack/react-router';

// firebase auth uses over 300kb of data
// lazy loading the UserAvatar component will reduce the initial bundle size
const UserAvatar = lazy(() => import('./userAvatar'));

const navItems = [
  {
    id: 1,
    text: 'Calendar',
    route: '/calendar',
    icon: <CalendarIcon className="mr-2 h-6 w-6" />,
  },
  {
    id: 2,
    text: 'Link Calendars',
    description:
      "Link your calendar with other users' accounts to view all linked calendars in a single, merged view. This allows you to easily manage and coordinate schedules across multiple users.",
    route: '/',
    icon: <UsersIcon className="mr-2 h-6 w-6" />,
  },
  {
    id: 3,
    text: 'Add Calendar Entry',
    route: '/',
    icon: <CalendarPlusIcon className="mr-2 h-6 w-6" />,
  },
  {
    id: 4,
    text: 'Sign Out',
    route: '/signout',
    icon: <LogOutIcon className="mr-2 h-6 w-6" />,
  },
];

export const Navbar = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <nav className="bg-primary z-1100 flex h-14 w-full items-center justify-between px-2 text-xl font-bold text-white md:h-12 md:px-4">
      <div className="flex items-center">
        {/* Avatar */}
        <UserAvatar />

        {/* Sharc Logo */}
        <Link to="/" aria-label="Home">
          <img src={sharcLogoWhite} alt="sharc logo" className="h-8" />
        </Link>
      </div>

      {/* Desktop Navigation Icon */}
      <button
        onClick={() => setMenuIsOpen(!menuIsOpen)}
        className="z-1400"
        aria-label={menuIsOpen ? 'Close menu' : 'Open menu'}
      >
        {menuIsOpen ? (
          <img src={crossIconWhite} className="h-4 pr-3" alt="Close menu" />
        ) : (
          <img src={nineDotsIcon} className="h-6 pr-2" alt="Open menu" />
        )}
      </button>

      {/* Desktop Navigation Menu */}
      <ul
        className={
          menuIsOpen
            ? 'bg-primary fixed top-12 right-0 z-1200 hidden max-h-[500px] w-[250px] overflow-hidden duration-500 ease-in-out md:block'
            : 'fixed top-12 right-0 z-9999 hidden max-h-0 w-[250px] overflow-hidden duration-500 ease-in-out md:block'
        }
      >
        {/* Desktop Navigation Items */}
        {menuIsOpen &&
          navItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-center border-b border-white"
            >
              <Link
                to={item.route}
                onClick={() => setMenuIsOpen(!menuIsOpen)}
                className="flex h-full w-full flex-col p-4 text-base hover:bg-orange-400"
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.text}
                </div>

                {item.description && (
                  <span className="text-grey-400 mt-2 text-xs font-medium">
                    {item.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
      </ul>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          menuIsOpen
            ? 'bg-primary fixed top-0 right-0 z-1200 h-full w-full duration-500 ease-in-out md:hidden'
            : '`z-1200 fixed top-0 bottom-0 left-[-100%] w-[10%] duration-500 ease-in-out md:hidden'
        }
      >
        {/* Mobile Navigation Logo */}
        <img
          src={sharcLogoWhite}
          alt="sharc logo"
          className="m-2 h-8 lg:hidden"
        />

        {/* Mobile Navigation Items */}
        {menuIsOpen &&
          navItems.map((item) => (
            <li
              key={item.id}
              className="z-1300 flex items-center justify-center border-b border-white"
            >
              <Link
                to={item.route}
                onClick={() => setMenuIsOpen(!menuIsOpen)}
                className="flex h-full w-full flex-col p-4 text-base hover:bg-orange-400"
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.text}
                </div>

                {item.description && (
                  <span className="text-grey-400 mt-2 text-xs font-medium">
                    {item.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};
