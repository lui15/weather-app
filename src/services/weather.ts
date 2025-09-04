import { ow } from "./api";
import { getCache, setCache } from "../store/cache";
import type { OneCall } from "../types/weather";

/** Tipos para endpoints 2.5 */
export type CurrentWeather = {
  coord: { lat: number; lon: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  name: string;
};

export type Forecast3h = {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: { all: number };
    wind: { speed: number; deg: number };
    pop: number;
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    timezone: number;
    coord: { lat: number; lon: number };
  };
};

/** Geocoding: nombre -> lat/lon */
export async function geocodeCity(q: string, limit = 5) {
  const { data } = await ow.get<
    Array<{
      name: string;
      lat: number;
      lon: number;
      country: string;
      state?: string;
    }>
  >("/geo/1.0/direct", { params: { q, limit } });
  return data;
}

/** Actual (2.5) con caché (2 min) */
export async function getCurrent({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<CurrentWeather> {
  const key = `current:${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = getCache(key, 120);
  if (cached) return cached;

  const { data } = await ow.get<CurrentWeather>("/data/2.5/weather", {
    params: { lat, lon },
  });
  setCache(key, data);
  return data;
}

/** Forecast 5 días / cada 3h (2.5) con caché (5 min) */
export async function getForecast({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<Forecast3h> {
  const key = `forecast:${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = getCache(key, 300);
  if (cached) return cached;

  const { data } = await ow.get<Forecast3h>("/data/2.5/forecast", {
    params: { lat, lon },
  });
  setCache(key, data);
  return data;
}

/**
 * Shim de compatibilidad: "getOneCall"
 * Construye un objeto con la forma de tu tipo OneCall usando getCurrent + getForecast (2.5),
 * para no tocar City/CityCard. (Hourly=3h; Daily=agregado aprox.)
 */
export async function getOneCall({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<OneCall> {
  const [current, forecast] = await Promise.all([
    getCurrent({ lat, lon }),
    getForecast({ lat, lon }),
  ]);

  // hourly: próximos 8 pasos de 3h = ~24h
  const hourly = forecast.list.slice(0, 8).map((it) => ({
    dt: it.dt,
    temp: it.main.temp,
    feels_like: it.main.feels_like ?? it.main.temp,
    pressure: it.main.pressure,
    humidity: it.main.humidity,
    wind_speed: it.wind.speed,
    wind_deg: it.wind.deg,
    clouds: it.clouds.all,
    pop: it.pop ?? 0,
    weather: it.weather,
  }));

  // DAILY: agregamos por día y añadimos sunrise/sunset requeridos por el tipo OneCall
  const baseSunrise = current.sys.sunrise; // forecast.city no trae sunrise/sunset en 2.5
  const baseSunset = current.sys.sunset;

  const ymd = (d: Date) => d.toISOString().slice(0, 10);
  const dayStart = (ymdStr: string) =>
    new Date(ymdStr + "T00:00:00Z").getTime() / 1000;

  const baseYMD = ymd(new Date(current.dt * 1000));
  const baseStart = dayStart(baseYMD);

  type DailyAgg = {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: { day: number; night: number; eve: number; morn: number };
    pressure: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    clouds: number;
    pop: number;
    weather: { id: number; main: string; description: string; icon: string }[];
  };

  const dailyMap = new Map<string, DailyAgg>();

  for (const it of forecast.list) {
    const d = new Date(it.dt * 1000);
    const key = ymd(d);
    const offsetDays = Math.round((dayStart(key) - baseStart) / 86400); // desplazamiento diario aprox

    const sunrise = baseSunrise + offsetDays * 86400;
    const sunset = baseSunset + offsetDays * 86400;

    const t = it.main.temp;
    const existing = dailyMap.get(key);

    if (!existing) {
      dailyMap.set(key, {
        dt: it.dt,
        sunrise,
        sunset,
        temp: { min: t, max: t, day: t, night: t, eve: t, morn: t },
        feels_like: { day: t, night: t, eve: t, morn: t },
        pressure: it.main.pressure,
        humidity: it.main.humidity,
        wind_speed: it.wind.speed,
        wind_deg: it.wind.deg,
        clouds: it.clouds.all,
        pop: it.pop ?? 0,
        weather: it.weather,
      });
    } else {
      existing.temp.min = Math.min(existing.temp.min, t);
      existing.temp.max = Math.max(existing.temp.max, t);
      existing.pop = Math.max(existing.pop, it.pop ?? 0);
    }
  }

  const daily = Array.from(dailyMap.values()).slice(0, 8);

  const oc: OneCall = {
    lat: current.coord.lat,
    lon: current.coord.lon,
    timezone: forecast.city?.name || "",
    timezone_offset: forecast.city?.timezone ?? 0,
    current: {
      dt: current.dt,
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
      temp: current.main.temp,
      feels_like: current.main.feels_like,
      pressure: current.main.pressure,
      humidity: current.main.humidity,
      wind_speed: current.wind.speed,
      wind_deg: current.wind.deg,
      clouds: current.clouds.all,
      visibility: 10000,
      weather: current.weather,
    },
    hourly,
    daily,
  };

  return oc;
}
