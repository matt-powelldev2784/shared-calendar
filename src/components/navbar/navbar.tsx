import sharcLogoWhite from "../../assets/logo/sharc_logo_white.svg";
import burgerIconWhite from "../../assets/icons/burger_icon_white.svg";
import crossIconWhite from "../../assets/icons/cross_white.svg";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import type { UserInfo } from "firebase/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";

export const Navbar = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo[] | undefined>();
  const userInitials =
    userInfo && userInfo[0].displayName
      ? userInfo[0].displayName
          ?.split(" ")
          .map((name) => name[0].slice(0))
          .join("")
      : "";

  const handleNav = () => {
    setNavIsOpen(!navIsOpen);
  };

  const navItems = [
    { id: 1, text: "Calendar" },
    { id: 2, text: "Share Calendar" },
    { id: 3, text: "Add Calendar Entry" },
    { id: 4, text: "Contact" },
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
      <nav className="bg-primary flex w-full items-center justify-between px-2 py-2 text-xl font-bold text-white md:px-4">
        <Link to="/">
          <img src={sharcLogoWhite} alt="sharc logo" className="h-8" />
        </Link>
      </nav>
    );
  }

  return (
    <nav className="bg-primary flex h-12 w-full items-center justify-between px-2 text-xl font-bold text-white md:px-4">
      <div className="flex items-center">
        {/* Avatar */}
        <Link to="/signout" className="mr-2 ml-0 md:ml-1">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="-translate-y-0.4 text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Sharc Logo  */}
        <Link to="/">
          <img src={sharcLogoWhite} alt="sharc logo" className="h-8" />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden flex-grow items-center justify-end md:flex">
        {navItems.map((item) => (
          <li
            key={item.id}
            className="mx-2 cursor-pointer rounded-xl px-2 text-base font-normal duration-300"
          >
            {item.text}
          </li>
        ))}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="z-50 block md:hidden">
        {navIsOpen ? (
          <img src={crossIconWhite} className="h-6 pr-2" />
        ) : (
          <img src={burgerIconWhite} className="h-6 pr-2 md:hidden" />
        )}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          navIsOpen
            ? "bg-primary fixed top-0 right-0 h-full w-full border-r border-r-gray-900 duration-500 ease-in-out md:hidden"
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
        {navItems.map((item) => (
          <li
            key={item.id}
            className="cursor-pointer border-b border-white p-4 text-base duration-300 hover:bg-orange-400"
          >
            {item.text}
          </li>
        ))}
      </ul>
    </nav>
  );
};
