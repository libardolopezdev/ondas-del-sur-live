interface EqualizerProps {
  bars?: number;
  className?: string;
}

export function Equalizer({ bars = 5, className = "" }: EqualizerProps) {
  return (
    <div className={`flex items-end gap-[3px] h-5 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] bg-primary rounded-full animate-equalizer"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: `${0.7 + (i % 3) * 0.2}s` }}
        />
      ))}
    </div>
  );
}
