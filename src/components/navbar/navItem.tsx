import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

type NavItemProps = {
  id: number;
  text: string;
  route: string;
  icon: JSX.Element;
  description?: string;
  onClick: () => void;
};

const NavItem = ({
  id,
  text,
  route,
  icon,
  description,
  onClick,
}: NavItemProps) => {
  return (
    <li
      key={id}
      className="flex items-center justify-center border-b border-white"
    >
      <Link
        to={route}
        onClick={onClick}
        className="flex h-full w-full flex-col p-4 text-base hover:bg-orange-400"
      >
        <div className="flex items-center">
          {icon}
          {text}
        </div>

        {description && (
          <span className="text-grey-400 mt-2 text-xs font-medium">
            {description}
          </span>
        )}
      </Link>
    </li>
  );
};

export default NavItem;
