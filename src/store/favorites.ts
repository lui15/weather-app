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
  toggle: (c: FavCity) => void;
};

const KEY = "fav_cities";

export const useFavorites = create<FavStore>((set, get) => ({
  items: JSON.parse(localStorage.getItem(KEY) || "[]"),
  isFav: (lat, lon) => get().items.some((x) => x.lat === lat && x.lon === lon),
  toggle: (c) => {
    const items = get().items;
    const exists = items.some((x) => x.lat === c.lat && x.lon === c.lon);
    const next = exists
      ? items.filter((x) => !(x.lat === c.lat && x.lon === c.lon))
      : [...items, c];
    localStorage.setItem(KEY, JSON.stringify(next));
    set({ items: next });
  },
}));
