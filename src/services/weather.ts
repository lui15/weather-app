import { ow } from "./api";
import { getCache, setCache } from "../store/cache";
import type { OneCall } from "../types/weather";

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

/** Shim OneCall p/ no tocar City/CityCard */
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

  const baseSunrise = current.sys.sunrise;
  const baseSunset = current.sys.sunset;
  const ymd = (d: Date) => d.toISOString().slice(0, 10);
  const dayStart = (s: string) => new Date(s + "T00:00:00Z").getTime() / 1000;
  const baseStart = dayStart(ymd(new Date(current.dt * 1000)));

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
    const offset = Math.round((dayStart(key) - baseStart) / 86400);
    const sunrise = baseSunrise + offset * 86400;
    const sunset = baseSunset + offset * 86400;
    const t = it.main.temp;

    const ex = dailyMap.get(key);
    if (!ex) {
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
      ex.temp.min = Math.min(ex.temp.min, t);
      ex.temp.max = Math.max(ex.temp.max, t);
      ex.pop = Math.max(ex.pop, it.pop ?? 0);
    }
  }
  const daily = Array.from(dailyMap.values()).slice(0, 8);

  return {
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
}
