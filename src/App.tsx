// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./app/layout/MainLayout";
import Landing from "./pages/Landing"; // ⬅️ importa la landing
import Home from "./pages/Home";
import City from "./pages/City";
import Favorites from "./pages/Favorites";

export default function App() {
  return (
    <Routes>
      {/* Landing fullscreen (sin MainLayout para evitar doble header) */}
      <Route path="/" element={<Landing />} />

      {/* Rutas de la app con layout */}
      <Route
        path="/feed"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/city/:coords/:label?"
        element={
          <MainLayout>
            <City />
          </MainLayout>
        }
      />
      <Route
        path="/favorites"
        element={
          <MainLayout>
            <Favorites />
          </MainLayout>
        }
      />

      {/* Compat / alias */}
      <Route path="/home" element={<Navigate to="/feed" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
