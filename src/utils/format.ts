export function iconUrl(code: string) {
  // Documentación de iconos de OpenWeather. Usa @2x para mejor calidad.
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}

export function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function fromUnix(sec: number) {
  return new Date(sec * 1000).toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fromUnixHour(sec: number) {
  return new Date(sec * 1000).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dayName(sec: number) {
  return new Date(sec * 1000).toLocaleDateString("es-ES", { weekday: "short" });
}

export function parseCoords(s: string) {
  const [a, b] = s.split(",");
  return { lat: parseFloat(a), lon: parseFloat(b) };
}

export function decodeLabel(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

// Debounce rápido sin hook adicional
import { useEffect, useState } from "react";
export function useDebounce<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
