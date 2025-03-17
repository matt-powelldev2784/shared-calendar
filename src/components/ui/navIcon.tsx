import type { FileRoutesByTo } from '@/routeTree.gen';
import { Link, useLocation } from '@tanstack/react-router';
import type { JSX } from 'react';

interface NavIconLinkProps {
  linkTo: keyof FileRoutesByTo;
  visibleRoutes?: (keyof FileRoutesByTo)[];
  onClick?: () => void;
  children?: JSX.Element;
  ariaLabel?: string;
  alwaysVisible?: boolean;
  className?: string;
}

export const NavIconLink = ({
  linkTo,
  visibleRoutes,
  onClick,
  children,
  ariaLabel,
  alwaysVisible,
  className,
}: NavIconLinkProps) => {
  const { pathname } = useLocation();

  if (alwaysVisible)
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

  if (visibleRoutes?.includes(pathname as keyof FileRoutesByTo))
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
  visibleRoutes?: (keyof FileRoutesByTo)[];
  children?: JSX.Element;
  ariaLabel?: string;
  alwaysVisible?: boolean;
  className?: string;
}

export const NavIconButton = ({
  onClick,
  visibleRoutes,
  children,
  ariaLabel,
  className,
  alwaysVisible,
}: NavIconProps) => {
  const { pathname } = useLocation();

  if (alwaysVisible)
    return (
      <button
        onClick={onClick}
        className={`z-1400 ${className}`}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );

  if (visibleRoutes?.includes(pathname as keyof FileRoutesByTo))
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
