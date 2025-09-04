import axios from "axios";

const API_KEY = import.meta.env.VITE_OWM_KEY as string | undefined;
if (!API_KEY) {
  console.error(
    "VITE_OWM_KEY vacío. Crea .env.local con VITE_OWM_KEY=<tu_key> y reinicia."
  );
}

export const ow = axios.create({
  baseURL: "https://api.openweathermap.org",
  params: { appid: API_KEY, units: "metric", lang: "es" },
  timeout: 8000,
});

// DEBUG: imprime URL final (mírala en consola del navegador)
ow.interceptors.request.use((cfg) => {
  try {
    const url = new URL((cfg.baseURL || "") + (cfg.url || ""));
    const def = (ow.defaults.params || {}) as Record<string, unknown>;
    Object.entries(def).forEach(([k, v]) =>
      url.searchParams.set(k, String(v ?? ""))
    );
    Object.entries(cfg.params || {}).forEach(([k, v]) =>
      url.searchParams.set(k, String(v ?? ""))
    );
    console.log("→", url.toString());
  } catch {}
  return cfg;
});
