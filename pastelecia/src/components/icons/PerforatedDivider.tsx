export function PerforatedDivider({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center ${className ?? ''}`} aria-hidden="true">
      <span className="absolute -left-6 h-3 w-3 rounded-full bg-paper-dim" />
      <div className="h-px w-full border-t-2 border-dashed border-ink/20" />
      <span className="absolute -right-6 h-3 w-3 rounded-full bg-paper-dim" />
    </div>
  );
}