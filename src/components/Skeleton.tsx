export default function Skeleton() {
  return (
    <div className="animate-pulse grid gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60"
        />
      ))}
    </div>
  );
}
