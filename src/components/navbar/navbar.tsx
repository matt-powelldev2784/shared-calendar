import { Button } from "../ui/button";
import sharcLogoWhite from "../../assets/logo/sharc_logo_white.png";
import downArrow from "../../assets/icons/down_arrow.svg";

export const Navbar = () => {
  return (
    <div className="bg-primary flex w-full items-center justify-between px-2 py-2 text-xl font-bold text-white md:px-4">
      <img src={sharcLogoWhite} alt="sharc logo" className="h-8" />
      <Button variant="outline" className="justify- flex items-center px-2">
        24 January 25
        <img src={downArrow} width="10" />
      </Button>
    </div>
  );
};
