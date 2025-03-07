import sharcLogoWhite from "../../assets/logo/sharc_logo_white.svg";
import crossIconWhite from "../../assets/icons/cross_white.svg";
import nineDotsIcon from "../../assets/icons/nine_dots.svg";
import { Calendar as CalendarIcon } from "lucide-react";
import { LogOut as LogOutIcon } from "lucide-react";
import { Users as UsersIcon } from "lucide-react";
import { CalendarPlus as CalendarPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import type { UserInfo } from "firebase/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";

export const Navbar = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo[] | undefined>();
  const userInitials =
    userInfo && userInfo[0].displayName
      ? userInfo[0].displayName
          ?.split(" ")
          .map((name) => name[0].slice(0))
          .join("")
      : "";

  const navItems = [
    {
      id: 1,
      text: "Calendar",
      route: "/calendar",
      icon: <CalendarIcon className="mr-2 h-6 w-6" />,
    },
    {
      id: 2,
      text: "Link Calendars",
      description:
        "Link your calendar with other users' accounts to view all linked calendars in a single, merged view. This allows you to easily manage and coordinate schedules across multiple users.",
      route: "/",
      icon: <UsersIcon className="mr-2 h-6 w-6" />,
    },
    {
      id: 3,
      text: "Add Calendar Entry",
      route: "/",
      icon: <CalendarPlusIcon className="mr-2 h-6 w-6" />,
    },
    {
      id: 4,
      text: "Sign Out",
      route: "/signout",
      icon: <LogOutIcon className="mr-2 h-6 w-6" />,
    },
  ];

  // get user information from firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user !== undefined && user !== null) {
        setUserInfo(user.providerData);
      } else {
        setUserInfo(undefined);
      }
    });

    return () => unsubscribe();
  }, []);

  // if user is not logged in, display only the logo
  if (!userInfo) {
    return (
      <nav className="bg-primary flex h-14 w-full items-center justify-between px-2 py-2 text-xl font-bold text-white md:h-12 md:px-4">
        <Link to="/" aria-label="Home">
          <img src={sharcLogoWhite} alt="sharc logo" className="h-8" />
        </Link>
      </nav>
    );
  }

  return (
    <nav className="bg-primary flex h-14 w-full items-center justify-between px-2 text-xl font-bold text-white md:h-12 md:px-4">
      <div className="flex items-center">
        {/* Avatar */}
        <Link to="/signout" className="mr-2 ml-0 md:ml-1" aria-label="Sign out">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="-translate-y-0.4 text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Sharc Logo */}
        <Link to="/" aria-label="Home">
          <img src={sharcLogoWhite} alt="sharc logo" className="h-8" />
        </Link>
      </div>

      {/* Desktop Navigation Icon */}
      <button
        onClick={() => setMenuIsOpen(!menuIsOpen)}
        className="z-50"
        aria-label={menuIsOpen ? "Close menu" : "Open menu"}
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
            ? "bg-primary fixed top-12 right-0 hidden max-h-[500px] w-[250px] overflow-hidden duration-500 ease-in-out md:block"
            : "fixed top-12 right-0 hidden max-h-0 w-[250px] overflow-hidden duration-500 ease-in-out md:block"
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
            ? "bg-primary fixed top-0 right-0 h-full w-full duration-500 ease-in-out md:hidden"
            : "fixed top-0 bottom-0 left-[-100%] w-[10%] duration-500 ease-in-out md:hidden"
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
    </nav>
  );
};
