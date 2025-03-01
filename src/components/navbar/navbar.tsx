import { Button } from "../ui/button";
import sharcLogoWhite from "../../assets/logo/sharc_logo_white.png";

export const Navbar = () => {
  return (
    <div className="bg-primary flex w-full items-center justify-between px-2 py-2 text-xl font-bold text-white md:px-4">
      <img src={sharcLogoWhite} alt="sharc logo" className="h-8" />
      <Button variant="outline">24 Jan 25</Button>
    </div>
  );
};
