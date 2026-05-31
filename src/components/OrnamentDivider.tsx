interface OrnamentDividerProps {
  text?: string;
  className?: string;
}

export default function OrnamentDivider({ text, className = '' }: OrnamentDividerProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-500/40" />
      {text ? (
        <span className="text-gold-500 text-sm font-medium px-2">✦ {text} ✦</span>
      ) : (
        <span className="text-gold-500 text-lg">✦</span>
      )}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-500/40" />
    </div>
  );
}
