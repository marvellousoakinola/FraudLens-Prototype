import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export { cn } from '../../lib/utils';

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  children,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-[var(--shadow-sm)] dark:shadow-[var(--soft-glow)] active:scale-[0.97] hover:translate-y-[-1px]',
    secondary: 'bg-secondary text-white hover:opacity-90 shadow-[var(--shadow-sm)] active:scale-[0.97] hover:translate-y-[-1px]',
    outline: 'border border-[var(--border-color)] bg-transparent hover:bg-[var(--background-secondary)] text-[var(--foreground-secondary)] active:scale-[0.97]',
    ghost: 'bg-transparent hover:bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:text-primary active:scale-[0.97]',
    danger: 'bg-[var(--danger)] text-white hover:opacity-90 shadow-[var(--shadow-sm)] active:scale-[0.97] hover:translate-y-[-1px]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2 rounded-full',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-smooth)] focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:translate-y-0',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('bg-surface backdrop-blur-md rounded-xl border border-border-main shadow-[var(--shadow-md)] transition-all duration-[var(--duration-medium)] ease-[var(--ease-smooth)] hover:translate-y-[-4px] hover:shadow-xl dark:hover:shadow-primary/5', className)}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={cn(
      'w-full rounded-lg border border-border-main bg-[var(--background-secondary)] px-4 py-2 text-sm text-[var(--foreground)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-smooth)] focus:border-primary focus:bg-[var(--surface)] focus:ring-2 focus:ring-primary/10 outline-none placeholder:text-[var(--foreground-muted)]',
      className
    )}
    {...props}
  />
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'info' }> = ({
  children,
  variant = 'info',
}) => {
  const variants = {
    success: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
    warning: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
    danger: 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20',
    info: 'bg-primary/10 text-primary border-primary/20',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider transition-colors', variants[variant])}>
      {children}
    </span>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-[var(--background-secondary)] overflow-hidden relative rounded-md", className)}>
    <div className="absolute inset-0 translate-x-[-100%] animate-shimmer bg-gradient-to-r from-transparent via-[var(--foreground)]/5 to-transparent shadow-[0_0_20px_rgba(0,0,0,0)]" />
  </div>
);
