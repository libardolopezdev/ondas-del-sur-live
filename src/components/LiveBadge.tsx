export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-live/15 border border-live/40 text-live text-xs font-bold tracking-widest uppercase">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-75 animate-pulse-live" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
      </span>
      En vivo
    </span>
  );
}
