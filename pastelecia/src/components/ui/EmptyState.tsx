import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl2 border border-dashed border-ink/15 bg-paper-dim px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/5 text-ink/40">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink/60">{description}</p>
      {action}
    </div>
  );
}