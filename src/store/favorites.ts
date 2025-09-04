import { create } from "zustand";

export type FavCity = {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
};

type FavStore = {
  items: FavCity[];
  isFav: (lat: number, lon: number) => boolean;
  add: (c: FavCity) => void;
  remove: (lat: number, lon: number) => void;
  toggle: (c: FavCity) => void;
};

const KEY = "fav_cities_v2";

export const useFavorites = create<FavStore>((set, get) => ({
  items: JSON.parse(localStorage.getItem(KEY) || "[]"),
  isFav: (lat, lon) => get().items.some((x) => x.lat === lat && x.lon === lon),
  add: (c) => {
    if (get().isFav(c.lat, c.lon)) return;
    const next = [...get().items, c];
    localStorage.setItem(KEY, JSON.stringify(next));
    set({ items: next });
  },
  remove: (lat, lon) => {
    const next = get().items.filter((x) => !(x.lat === lat && x.lon === lon));
    localStorage.setItem(KEY, JSON.stringify(next));
    set({ items: next });
  },
  toggle: (c) =>
    get().isFav(c.lat, c.lon) ? get().remove(c.lat, c.lon) : get().add(c),
}));
