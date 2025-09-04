import CitySearch from "../components/CitySearch";
import { useFavorites } from "../store/favorites";
import CityCard from "../components/CityCard";

export default function Home() {
  const favs = useFavorites();
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Busca una ciudad</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Añádela a favoritos y consulta su pronóstico.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <CitySearch />
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-3">⭐ Favoritos</h3>
        {favs.items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Aún no hay favoritos. Busca y guarda una ciudad.
          </p>
        ) : (
          <div className="grid gap-4">
            {favs.items.map((c, i) => (
              <CityCard key={`${c.lat},${c.lon}-${i}`} {...c} compact />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
