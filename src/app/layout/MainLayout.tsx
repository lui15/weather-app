import ToggleTheme from "../../components/ToggleTheme";
import { Link, NavLink } from "react-router-dom";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const base = "px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800";
  const active = "!bg-black !text-white dark:!bg-white dark:!text-black";
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-zinc-100">
      <header
        className="sticky top-0 z-10 border-b border-zinc-200/60 bg-white/80 backdrop-blur
                         dark:border-zinc-800/60 dark:bg-black/70"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">
            Weather-App
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <NavLink
              to="/feed"
              className={({ isActive }) => `${base} ${isActive ? active : ""}`}
            >
              Buscar
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => `${base} ${isActive ? active : ""}`}
            >
              ⭐ Favoritos
            </NavLink>
            <ToggleTheme /> {/* ← ÚNICO botón de tema */}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
