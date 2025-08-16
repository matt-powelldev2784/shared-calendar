import type { FileRoutesByTo } from '@/routeTree.gen';
import { Link } from '@tanstack/react-router';
import type { ReactElement } from 'react';

interface NavIconLinkProps {
  linkTo: keyof FileRoutesByTo;
  desktopIcon?: ReactElement;
  mobileIcon?: ReactElement;
  text?: string;
  ariaLabel?: string;
  className?: string;
  isActive?: boolean;
}

export const NavIconLink = ({
  linkTo,
  desktopIcon,
  mobileIcon,
  text,
  ariaLabel,
  className,
  isActive,
}: NavIconLinkProps) => {
  const isActiveStyleDesktop = isActive
    ? { borderBottom: '2px solid #2f75eb', color: '#2f75eb' }
    : { color: '#676767' };
  const isActiveStyleMobile = isActive ? { color: '#2f75eb' } : { color: '#676767' };

  return (
    <>
      {/* Mobile View */}
      <Link
        to={linkTo}
        className={`flex h-full flex-col items-center justify-center font-semibold md:hidden ${className}`}
        style={isActiveStyleMobile}
        aria-label={ariaLabel}
      >
        {mobileIcon}
        {/* <p className="text-[10.5px]">{text}</p> */}
      </Link>

      {/* Desktop View */}
      <Link
        to={linkTo}
        className={`hidden h-full items-center justify-center gap-2 px-4 font-semibold md:flex ${className}`}
        style={isActiveStyleDesktop}
        aria-label={ariaLabel}
      >
        {desktopIcon}
        {text && <p>{text}</p>}
      </Link>
    </>
  );
};

interface NavIconButtonProps {
  onClick?: () => void;
  icon?: ReactElement;
  ariaLabel?: string;
  className?: string;
  isActive?: boolean;
}

export const NavIconButton = ({ onClick, icon, ariaLabel, className, isActive }: NavIconButtonProps) => {
  const bottomBorderStyle = isActive ? { borderBottom: '2px solid #2f75eb' } : {};

  return (
    <>
      <button
        onClick={onClick}
        className={`flex h-full flex-col items-center justify-center font-semibold ${className} '}`}
        style={bottomBorderStyle}
        aria-label={ariaLabel}
      >
        {icon}
      </button>
    </>
  );
};
