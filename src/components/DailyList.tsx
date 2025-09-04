import type { OneCall } from "../types/weather";
import { iconUrl, dayName, round1 } from "../utils/format";

export default function DailyList({ data }: { data: OneCall["daily"] }) {
  return (
    <div className="grid md:grid-cols-4 gap-3">
      {data.slice(0, 8).map((d, i) => {
        const w = d.weather?.[0];
        return (
          <div
            key={i}
            className="rounded-xl border p-3 flex items-center gap-3"
          >
            <div className="w-12 text-sm">{dayName(d.dt)}</div>
            {w && (
              <img
                src={iconUrl(w.icon)}
                alt={w.description}
                className="w-10 h-10"
              />
            )}
            <div className="ml-auto text-sm">
              <div>
                Max: <b>{round1(d.temp.max)}°</b>
              </div>
              <div>
                Min: <b>{round1(d.temp.min)}°</b>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
