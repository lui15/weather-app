import axios from "axios";

export const ow = axios.create({
  baseURL: "https://api.openweathermap.org",
  params: {
    appid: import.meta.env.VITE_OWM_KEY,
    units: "metric",
    lang: "es",
  },
  timeout: 8000,
});
