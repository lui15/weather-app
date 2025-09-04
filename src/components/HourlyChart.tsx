import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { OneCall } from "../types/weather";
import { fromUnixHour, round1 } from "../utils/format";

export default function HourlyChart({ data }: { data: OneCall["hourly"] }) {
  const chart = data
    .slice(0, 24)
    .map((h) => ({ t: fromUnixHour(h.dt), temp: h.temp }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chart}
          margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis tickFormatter={(v) => `${round1(v)}°`} />
          <Tooltip formatter={(v) => [`${round1(v as number)}°C`, "Temp"]} />
          <Line type="monotone" dataKey="temp" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
