import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

export type NavItemProps = {
  id: number | string;
  text: string;
  route?: string;
  icon: JSX.Element;
  description?: string;
  onClick?: (event: any) => void;
};

const NavItem = ({ id, text, route, icon, description, onClick }: NavItemProps) => {
  return (
    <li key={id} className="calendar-entry-bg flex items-center justify-center text-black">
      <Link to={route} onClick={onClick} className="hover:bg-primary/20 flex h-full w-full flex-col p-4">
        <div className="flex items-center gap-4">
          <span className="h-6 w-6">{icon}</span>
          <p className="mr-1 text-sm font-bold">{text}</p>
        </div>

        {description && <span className="mt-2 text-xs">{description}</span>}
      </Link>
    </li>
  );
};

const NavItemPlaceholder = ({ id, text, icon, onClick }: NavItemProps) => {
  return (
    <li key={id} className="calendar-entry-bg flex items-center justify-center text-black">
      <div onClick={onClick} className="flex h-full w-full flex-col p-4">
        <div className="flex items-center gap-4">
          <span className="h-6 w-6">{icon}</span>
          <p className="mr-1 text-sm font-bold">{text}</p>
        </div>
      </div>
    </li>
  );
};

export { NavItem, NavItemPlaceholder };
