import { useEffect, useState } from "react";
import { geocodeCity } from "../services/weather";
import { useDebounce } from "../utils/format";
import { useNavigate } from "react-router-dom";

type Suggestion = {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
};

export default function CitySearch() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const d = useDebounce(q, 400);
  const nav = useNavigate();

  useEffect(() => {
    let alive = true;
    if (!d) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    geocodeCity(d, 5)
      .then((list) => {
        if (alive) setSuggestions(list);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [d]);

  function goTo(s: Suggestion) {
    const label = encodeURIComponent(
      `${s.name},${s.state ? s.state + "," : ""}${s.country}`
    );
    nav(`/city/${s.lat},${s.lon}/${label}`);
    setQ("");
    setSuggestions([]);
  }

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busca una ciudad (ej. Madrid, Lima, CDMX)…"
        className="w-full md:w-[32rem] px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
        aria-label="Buscar ciudad"
      />
      {loading && (
        <div className="absolute right-3 top-2.5 text-sm text-zinc-500">
          Cargando…
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full md:w-[32rem] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(s)}
              className="w-full text-left px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              {s.name}
              {s.state ? `, ${s.state}` : ""}, {s.country}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
