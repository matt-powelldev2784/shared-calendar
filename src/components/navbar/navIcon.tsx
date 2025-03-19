import type { FileRoutesByTo } from '@/routeTree.gen';
import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

interface NavIconLinkProps {
  linkTo: keyof FileRoutesByTo;
  onClick?: () => void;
  children?: JSX.Element;
  ariaLabel?: string;
  className?: string;
}

export const NavIconLink = ({
  linkTo,
  onClick,
  children,
  ariaLabel,
  className,
}: NavIconLinkProps) => {
  return (
    <Link
      onClick={onClick}
      to={linkTo}
      className={`z-1400 ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
};

interface NavIconProps {
  onClick?: (event: any) => void;
  children?: JSX.Element;
  ariaLabel?: string;
  className?: string;
}

export const NavIconButton = ({
  onClick,
  children,
  ariaLabel,
  className,
}: NavIconProps) => {
  return (
    <button
      onClick={onClick}
      className={`z-1400 ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
