export default function Loading() {
  const bone = "animate-shimmer rounded-xl bg-gradient-to-r from-brand-soft via-brand-line to-brand-soft bg-[length:200%_100%]";
  return (
    <div className="space-y-5" aria-busy="true">
      <div className={`h-8 w-48 ${bone}`} />
      <div className={`h-12 ${bone}`} />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => <div key={i} className={`h-28 ${bone}`} />)}
      </div>
    </div>
  );
}
