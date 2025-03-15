import type { FileRoutesByTo } from '@/routeTree.gen';
import { Link, useLocation } from '@tanstack/react-router';
import type { JSX } from 'react';

interface NavIconProps {
  linkTo: keyof FileRoutesByTo;
  icon?: JSX.Element;
  visibleRoutes?: (keyof FileRoutesByTo)[];
  onClick?: () => void;
  children?: JSX.Element;
  ariaLabel?: string;
  alwaysVisible?: boolean;
  className?: string;
}

const NavIcon = ({
  linkTo,
  icon,
  visibleRoutes,
  onClick,
  children,
  ariaLabel,
  alwaysVisible,
  className,
}: NavIconProps) => {
  const { pathname } = useLocation();

  if (alwaysVisible)
    return (
      <Link
        onClick={onClick}
        to={linkTo}
        className={`z-1400 flex items-center justify-center ${className}`}
        aria-label={ariaLabel}
      >
        {icon && icon}

        {children}
      </Link>
    );

  if (visibleRoutes?.includes(pathname as keyof FileRoutesByTo))
    return (
      <Link
        onClick={onClick}
        to={linkTo}
        className={`z-1400 flex items-center justify-center ${className}`}
        aria-label={ariaLabel}
      >
        {(visibleRoutes?.includes(pathname as keyof FileRoutesByTo) && icon) ||
          null}

        {children}
      </Link>
    );
};

export default NavIcon;
