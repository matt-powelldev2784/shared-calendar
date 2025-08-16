import type { FileRoutesByTo } from '@/routeTree.gen';
import { Link } from '@tanstack/react-router';
import type { ReactElement, ReactNode } from 'react';

interface NavIconLinkProps {
  linkTo: keyof FileRoutesByTo;
  onClick?: () => void;
  children?: ReactElement;
  ariaLabel?: string;
  className?: string;
}

export const NavIconLink = ({ linkTo, onClick, children, ariaLabel, className }: NavIconLinkProps) => {
  return (
    <Link
      onClick={onClick}
      to={linkTo}
      className={`flex items-center justify-center font-semibold ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
};

interface NavIconButtonProps {
  onClick?: (event: any) => void;
  children?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export const NavIconButton = ({ onClick, children, ariaLabel, className }: NavIconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`z-1400 flex h-8 w-8 flex-row items-center justify-center gap-2 ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

