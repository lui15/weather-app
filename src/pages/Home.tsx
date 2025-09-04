import CitySearch from "../components/CitySearch";
import { useFavorites } from "../store/favorites";
import CityCard from "../components/CityCard";

export default function Home() {
  const favs = useFavorites();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Busca ciudades y guárdalas</h2>
        <CitySearch />
      </div>

      {favs.items.length > 0 ? (
        <div className="grid gap-4">
          {favs.items.map((c, i) => (
            <CityCard key={`${c.lat},${c.lon}-${i}`} {...c} compact />
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">
          Aún no tienes favoritos. Busca una ciudad y pulsa “Guardar”.
        </p>
      )}
    </div>
  );
}
