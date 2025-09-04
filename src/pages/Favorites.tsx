import { useFavorites } from "../store/favorites";
import CityCard from "../components/CityCard";
import EmptyState from "../components/EmptyState";

export default function Favorites() {
  const favs = useFavorites();
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">⭐ Favoritos</h2>
      {favs.items.length === 0 ? (
        <EmptyState text="Aún no has guardado ciudades." />
      ) : (
        <div className="grid gap-4">
          {favs.items.map((c, i) => (
            <CityCard key={`${c.lat},${c.lon}-${i}`} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}
