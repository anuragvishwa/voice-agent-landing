import { cn } from '../../lib/utils';

export function Button({
  children,
  variant = 'default',
  size = 'default',
  className,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-mono text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20',
    outline: 'border border-white/10 bg-white/5 hover:bg-white/10 text-white',
    ghost: 'hover:bg-white/5 text-white',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-12 px-8',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
