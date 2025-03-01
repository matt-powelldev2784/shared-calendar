import sharcLogoWhite from "../../assets/logo/sharc_logo_white.svg";
import burgerIconWhite from "../../assets/icons/burger_icon_white.svg";

export const Navbar = () => {
  return (
    <nav className="bg-primary flex w-full items-center justify-between px-2 py-2 text-xl font-bold text-white md:px-4">
      <img src={sharcLogoWhite} alt="sharc logo" className="h-8" />
      <img
        src={burgerIconWhite}
        alt="menu icon"
        className="mr-2 block h-6 md:hidden"
      />
    </nav>
  );
};
