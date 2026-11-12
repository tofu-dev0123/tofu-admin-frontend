import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

// 全 variant 共通: カーソル・ホバー/押下トランジション・フォーカスリング・無効表示を統一する
const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out active:scale-[0.97] active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 aria-busy:cursor-progress aria-busy:opacity-80 aria-busy:[&>svg:not([role=status])]:hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/80',
        destructive:
          'bg-destructive text-white shadow-sm hover:bg-destructive/90 active:bg-destructive/80',
        outline:
          'border border-input bg-background text-neutral-700 shadow-sm hover:border-neutral-400 hover:bg-accent hover:text-accent-foreground active:bg-neutral-200',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-neutral-200 active:bg-neutral-300',
        ghost:
          'text-neutral-600 hover:bg-accent hover:text-accent-foreground active:bg-neutral-200',
        'ghost-destructive':
          'text-neutral-600 hover:bg-destructive/10 hover:text-destructive active:bg-destructive/20',
        link: 'text-primary underline-offset-4 hover:underline active:scale-100 active:text-neutral-700',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
        'icon-xs': 'h-5 w-5 [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  // 処理中表示。true の間はクリック不可にし、先頭にスピナーを出す（asChild 時はスピナーなし）
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={disabled || loading}
        aria-busy={loading || props['aria-busy'] || undefined}
      >
        {loading && !asChild ? (
          <>
            {/* 状態は aria-busy で伝えるため、スピナーは読み上げ対象外にする */}
            <Spinner aria-hidden="true" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
