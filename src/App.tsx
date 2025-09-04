import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./app/layout/MainLayout";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import City from "./pages/City";
import Favorites from "./pages/Favorites";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
