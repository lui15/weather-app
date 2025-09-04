import ToggleTheme from "../../components/ToggleTheme";
import { Link, NavLink } from "react-router-dom";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const base = "px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800";
  const active =
    "!bg-zinc-900 !text-white dark:!bg-zinc-100 dark:!text-zinc-900";
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">
            ⛅ Weather Dashboard
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `${base} ${isActive ? active : ""}`}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => `${base} ${isActive ? active : ""}`}
            >
              ⭐ Favoritos
            </NavLink>
            <ToggleTheme />
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 pb-16">{children}</main>
      <footer className="text-center text-xs text-zinc-500 pb-6">
        Datos por OpenWeather (One Call 3.0 + Geocoding). Icons © OpenWeather.
      </footer>
    </div>
  );
}
