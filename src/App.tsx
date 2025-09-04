import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./app/layout/MainLayout";
import Home from "./pages/Home";
import City from "./pages/City";
import Favorites from "./pages/Favorites";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/city/:coords/:label?" element={<City />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}
