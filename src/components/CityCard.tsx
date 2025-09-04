import { useEffect, useState } from "react";
import { getOneCall } from "../services/weather";
import type { OneCall } from "../types/weather";
import { iconUrl, fromUnix, round1 } from "../utils/format";
import { useFavorites } from "../store/favorites";
import { Link } from "react-router-dom";

type Props = {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  compact?: boolean;
};

export default function CityCard({
  name,
  country,
  state,
  lat,
  lon,
  compact,
}: Props) {
  const [data, setData] = useState<{
    loading: boolean;
    error: string;
    oc: OneCall | null;
  }>({ loading: true, error: "", oc: null });
  const favs = useFavorites();

  useEffect(() => {
    let alive = true;
    getOneCall({ lat, lon })
      .then((oc) => alive && setData({ loading: false, error: "", oc }))
      .catch(
        (e) =>
          alive &&
          setData({ loading: false, error: e?.message ?? "Error", oc: null })
      );
    return () => {
      alive = false;
    };
  }, [lat, lon]);

  const label = `${name}${state ? `, ${state}` : ""}, ${country}`;
  const to = `/city/${lat},${lon}/${encodeURIComponent(label)}`;

  if (data.loading)
    return <div className="p-4 rounded-2xl border animate-pulse h-28" />;
  if (data.error || !data.oc)
    return (
      <div className="p-4 rounded-2xl border">
        Error: {data.error || "Sin datos"}
      </div>
    );

  const c = data.oc.current;
  const w = c.weather?.[0];

  return (
    <article className="rounded-2xl border p-4 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{label}</h3>
          <p className="text-xs text-zinc-500">
            {fromUnix(c.dt)} · {data.oc.timezone}
          </p>
        </div>
        <button
          onClick={() => favs.toggle({ name, country, state, lat, lon })}
          className="text-sm px-3 py-1 rounded-full border"
        >
          {favs.isFav(lat, lon) ? "★ Quitar" : "☆ Guardar"}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-4">
        {w && (
          <img
            src={iconUrl(w.icon)}
            alt={w.description}
            className="w-14 h-14"
          />
        )}
        <div className="text-3xl font-bold">{round1(c.temp)}°C</div>
        <div className="text-sm text-zinc-500">{w?.description}</div>
        {!compact && (
          <div className="ml-auto grid grid-cols-2 gap-x-6 text-sm">
            <div>💧 Humedad: {c.humidity}%</div>
            <div>🌬️ Viento: {round1(c.wind_speed)} m/s</div>
            <div>🌡️ Sensación: {round1(c.feels_like)}°C</div>
            <div>☁️ Nubes: {c.clouds}%</div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <Link to={to} className="text-sm underline">
          Ver detalle →
        </Link>
      </div>
    </article>
  );
}
