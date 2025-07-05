import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Registro from './components/signup/registro';
import DashboardAdmin from "./components/Dashboard/DashboardAdmin";
import DashboardTesorero from "./components/Dashboard/DashboardTesorero";
import DashboardSeminarista from "./components/Dashboard/Seminarista/DashboardSeminarista";
import DashboardExterno from "./components/Dashboard/DashboardExterno";
import EventosNavegables from "./components/Dashboard/Seminarista/EventosNavegables";
import CabanasNavegables from "./components/Dashboard/Seminarista/CabanasNavegables";
import MisInscripciones from "./components/Dashboard/Seminarista/MisInscripciones";
import MisReservas from "./components/Dashboard/Seminarista/MisReservas";
import MisSolicitudes from "./components/Dashboard/Seminarista/MisSolicitudes";
import NuevaSolicitud from "./components/Dashboard/Seminarista/NuevaSolicitud";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/registro" element={<Registro />} />
        <Route path="/admin/users" element={<DashboardAdmin />} />
        <Route path="/tesorero/dashboard" element={<DashboardTesorero />} />
        <Route path="/seminarista/dashboard" element={<DashboardSeminarista />} />
        <Route path="/externo/dashboard" element={<DashboardExterno />} />
        {/* Rutas para las secciones del dashboard seminarista */}
        <Route path="/dashboard/seminarista/eventos" element={<EventosNavegables />} />
        <Route path="/dashboard/seminarista/cabanas" element={<CabanasNavegables />} />
        <Route path="/dashboard/seminarista/mis-inscripciones" element={<MisInscripciones />} />
        <Route path="/dashboard/seminarista/mis-reservas" element={<MisReservas />} />
        <Route path="/dashboard/seminarista/mis-solicitudes" element={<MisSolicitudes />} />
        <Route path="/dashboard/seminarista/nueva-solicitud" element={<NuevaSolicitud />} />
      </Routes>
    </Router>
  );
}

export default App;