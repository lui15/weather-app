import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOneCall } from "../services/weather";
import type { OneCall } from "../types/weather";
import {
  fromUnix,
  parseCoords,
  decodeLabel,
  iconUrl,
  round1,
} from "../utils/format";
import EmptyState from "../components/EmptyState";
import HourlyChart from "../components/HourlyChart";
import DailyList from "../components/DailyList";

export default function City() {
  const { coords, label } = useParams<{ coords: string; label?: string }>();
  const { lat, lon } = parseCoords(coords!);
  const [state, setState] = useState<{
    loading: boolean;
    error: string;
    data: OneCall | null;
  }>({ loading: true, error: "", data: null });

  useEffect(() => {
    let alive = true;
    getOneCall({ lat, lon })
      .then(
        (data: any) => alive && setState({ loading: false, error: "", data })
      )
      .catch(
        (e: any) =>
          alive &&
          setState({ loading: false, error: e?.message ?? "Error", data: null })
      );
    return () => {
      alive = false;
    };
  }, [lat, lon]);

  if (state.loading) return <p>Cargando…</p>;
  if (state.error || !state.data)
    return <EmptyState text={`Error: ${state.error || "Sin datos"}`} />;

  const oc = state.data;
  const c = oc.current;
  const w = c.weather?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">
          {label ? decodeLabel(label) : `${lat}, ${lon}`}
        </h2>
        <span className="text-sm text-zinc-500">
          {oc.timezone} · {fromUnix(c.dt)}
        </span>
      </div>

      <div className="rounded-2xl border p-4 bg-white dark:bg-zinc-800">
        <div className="flex items-center gap-4">
          {w && (
            <img
              src={iconUrl(w.icon)}
              alt={w.description}
              className="w-16 h-16"
            />
          )}
          <div className="text-4xl font-bold">{round1(c.temp)}°C</div>
          <div className="text-sm text-zinc-500">{w?.description}</div>
          <div className="ml-auto grid grid-cols-2 gap-x-6 text-sm">
            <div>💧 {c.humidity}%</div>
            <div>🌬️ {round1(c.wind_speed)} m/s</div>
            <div>☁️ {c.clouds}%</div>
            <div>🔻 Presión: {c.pressure} hPa</div>
          </div>
        </div>
      </div>

      <section>
        <h3 className="font-semibold mb-2">Próximas 24 h</h3>
        <HourlyChart data={oc.hourly} />
      </section>

      <section>
        <h3 className="font-semibold mb-2">Próximos 8 días</h3>
        <DailyList data={oc.daily} />
      </section>
    </div>
  );
}
