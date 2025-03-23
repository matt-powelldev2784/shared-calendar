import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

export type NavItemProps = {
  id: number | string;
  text: string;
  route?: string;
  icon: JSX.Element;
  description?: string;
  onClick?: (event: any) => void;
  notificationCount?: number;
};

const NavItem = ({
  id,
  text,
  route,
  icon,
  description,
  onClick,
  notificationCount = 0,
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
        <div className="flex items-center gap-4">
          <span className="h-6 w-6">{icon}</span>
          <p
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
            className="mr-1 text-sm font-bold"
          >
            {text}
          </p>

          {notificationCount > 0 && text === 'Notifications' && (
            <p className="bg-destructive flex h-7 w-7 items-center justify-center rounded-full text-base text-white">
              {notificationCount}
            </p>
          )}
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
