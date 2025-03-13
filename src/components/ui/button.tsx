import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 cursor-pointer',
        outline:
          'border-white border-2 border-secondary shadow-xs cursor-pointer text-secondary font-bold',
        outlineThin:
          'border border-1 border-secondary shadow-xs cursor-pointer text-secondary font-bold',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 cursor-pointer',
        ghost: 'hover:bg-accent hover:text-accent-foreground cursor-pointer',
        link: 'text-primary underline-offset-4 hover:underline cursor-pointer',
        datePicker:
          'cursor-pointer border-secondary text-secondary flex w-[96%] justify-between border-2 px-2 text-center text-lg font-bold md:max-w-96',
        googleButton:
          'bg-white text-secondary shadow-xs hover:bg-gray-100 border-2 border-secondary text-lg font-bold',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md px-3 has-[>svg]:px-2.5 w-full sm:min-w-36',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4 w-full sm:min-w-48',
        xl: 'h-12 rounded-md px-6 has-[>svg]:px-4 w-full sm:min-w-64',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
