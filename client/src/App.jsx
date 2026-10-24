// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./components/SideBar.jsx";
import Peraturan from "./pages/Peraturan.jsx";
import TugasUtama from "./pages/TugasUtama.jsx";
import TugasHarian from "./pages/TugasHarian.jsx";
import Acara from "./pages/Acara.jsx";
import Doa from "./pages/Doa.jsx";
import Admin from "./pages/Admin.jsx";
import Informasi from "./pages/Informasi.jsx";
import EditSandi from "./components/EditSandi.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SideBar />}>
          <Route index element={<Navigate to="/peraturan" replace />} />
          <Route path="peraturan" element={<Peraturan />} />
          <Route path="tugas-utama" element={<TugasUtama />} />
          <Route path="tugas-harian" element={<TugasHarian />} />
          <Route path="acara" element={<Acara />} />
          <Route path="doa" element={<Doa />} />
          <Route path="admin" element={<Admin />} />
          <Route path="informasi" element={<Informasi />} />
        </Route>
        <Route path="edit-sandi" element={<EditSandi />} />
      </Routes>
    </BrowserRouter>
  );
}
