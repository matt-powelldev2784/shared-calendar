import { type JSX } from 'react';

type ModernMenuButtonProps = {
  icon: JSX.Element;
  label: string;
  onClick?: () => void;
  href?: string;
  notificationCount?: number;
  variant?: 'default' | 'primary' | 'danger';
};

export const ModernMenuButton = ({
  icon,
  label,
  onClick,
  href,
  notificationCount = 0,
  variant = 'default',
}: ModernMenuButtonProps) => {
  const variantClasses = {
    default: 'text-slate-300 hover:text-white hover:bg-slate-800',
    primary: 'text-white bg-blue-600 hover:bg-blue-700',
    danger: 'text-slate-300 hover:text-red-400 hover:bg-red-500/10',
  };

  const ButtonComponent = href ? 'a' : 'button';

  return (
    <ButtonComponent
      {...(href ? { href } : { onClick })}
      className={`relative flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none ${variantClasses[variant]} `}
      aria-label={label}
    >
      {/* Icon with notification badge */}
      <div className="relative">
        {icon}

        {/* Simple notification dot */}
        {notificationCount > 0 && (
          <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500">
            <span className="text-xs font-medium text-white">{notificationCount > 9 ? '9' : notificationCount}</span>
          </div>
        )}
      </div>

      {/* Label - hidden on mobile */}
      <span className="hidden text-sm font-medium sm:block">{label}</span>
    </ButtonComponent>
  );
};
