export default function EmptyState({
  text = "Sin resultados",
}: {
  text?: string;
}) {
  return (
    <div className="text-center p-10 border rounded-2xl border-dashed">
      <div className="text-2xl mb-2">🔍</div>
      <p className="text-sm text-zinc-500">{text}</p>
    </div>
  );
}
