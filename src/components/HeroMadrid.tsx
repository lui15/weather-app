import { useEffect, useState } from "react";
import { getCurrent, type CurrentWeather } from "../services/weather";
const iconUrl = (i: string) => `https://openweathermap.org/img/wn/${i}@2x.png`;
const round1 = (n: number) => Math.round(n * 10) / 10;

export default function HeroMadrid() {
  const [s, setS] = useState<{
    loading: boolean;
    error: string;
    data: CurrentWeather | null;
  }>({
    loading: true,
    error: "",
    data: null,
  });

  useEffect(() => {
    let alive = true;
    getCurrent({ lat: 40.4168, lon: -3.7038 })
      .then((data) => alive && setS({ loading: false, error: "", data }))
      .catch(
        (e) =>
          alive &&
          setS({ loading: false, error: e?.message ?? "Error", data: null })
      );
    return () => {
      alive = false;
    };
  }, []);

  if (s.loading)
    return (
      <div
        className="w-full md:w-[900px] h-[360px] rounded-xl border
                                       border-zinc-300 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/40 animate-pulse"
      />
    );
  if (s.error || !s.data)
    return (
      <div
        className="w-full md:w-[900px] h-[360px] rounded-xl border
                                       border-red-300 bg-red-50/70 dark:border-red-800 dark:bg-red-900/20
                                       flex items-center justify-center"
      >
        {s.error || "Sin datos"}
      </div>
    );

  const c = s.data;
  const w = c.weather?.[0];

  return (
    <div
      className="w-full md:w-[900px] rounded-xl border p-6
                    border-zinc-300 bg-white
                    dark:border-zinc-800 dark:bg-zinc-900/60"
    >
      <h3 className="text-center text-lg font-semibold mb-4">
        Tiempo en Madrid
      </h3>
      <div className="flex items-center gap-4">
        {w && (
          <img
            src={iconUrl(w.icon)}
            alt={w.description}
            className="w-16 h-16"
          />
        )}
        <div className="text-4xl font-bold">{round1(c.main.temp)}°C</div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          {w?.description}
        </div>
        <div className="ml-auto grid grid-cols-2 gap-x-6 text-sm">
          <div>💧 {c.main.humidity}%</div>
          <div>🌬️ {round1(c.wind.speed)} m/s</div>
          <div>☁️ {c.clouds.all}%</div>
          <div>🔻 {c.main.pressure} hPa</div>
        </div>
      </div>
    </div>
  );
}
