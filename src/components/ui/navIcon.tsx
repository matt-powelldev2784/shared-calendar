import { Link, useLocation } from '@tanstack/react-router';
import type { JSX } from 'react';

interface NavIconProps {
  linkTo: string;
  icon?: JSX.Element;
  visibleRoutes?: string;
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

  if (visibleRoutes?.includes(pathname))
    return (
      <Link
        onClick={onClick}
        to={linkTo}
        className={`z-1400 flex items-center justify-center ${className}`}
        aria-label={ariaLabel}
      >
        {(visibleRoutes?.includes(pathname) && icon) || null}

        {children}
      </Link>
    );
};

export default NavIcon;
