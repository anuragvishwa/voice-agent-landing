import { cn } from '../../lib/utils';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-canvas p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
