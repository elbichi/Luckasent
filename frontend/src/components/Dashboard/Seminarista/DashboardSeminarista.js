import React, { useState, useEffect } from 'react';
import NavegacionSeminarista from './NavegacionSeminarista';
import EventosNavegables from './EventosNavegables';
import CabanasNavegables from './CabanasNavegables';
import FormularioReserva from './FormularioReserva';
import ModificarPerfil from './ModificarPerfil';
import InscripcionTablaContainer from './Tablas/InscripcionTablaContainer';
import ReservaTablaContainer from './Tablas/ReservaTablaContainer';
import SolicitudTabla from './Tablas/SolicitudTabla';
import SolicitudModal from './Modales/SolicitudModal';
import { useAuthCheck } from '../../hooks/useAuthCheck';

// Modular Components
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import NotificationBanner from './components/NotificationBanner';

import './DashboardSeminarista.css';

const DashboardSeminarista = () => {
  const [activeTab, setActiveTab] = useState('navegacion');
  const [modalOpen, setModalOpen] = useState(false);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [mostrarFormularioReserva, setMostrarFormularioReserva] = useState(false);
  const [mostrarModificarPerfil, setMostrarModificarPerfil] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('info');
  const [breadcrumbPath, setBreadcrumbPath] = useState(['Dashboard', 'Seminarista']);
  
  // Verificar autenticación y rol
  const { isAuthenticated, user } = useAuthCheck('seminarista');

  // Escuchar evento de modificar perfil
  useEffect(() => {
    const handleModificarPerfil = () => {
      setMostrarModificarPerfil(true);
    };

    window.addEventListener('modificar-perfil', handleModificarPerfil);
    return () => {
      window.removeEventListener('modificar-perfil', handleModificarPerfil);
    };
  }, []);

  // Si no está autenticado, el hook se encarga de la redirección
  if (!isAuthenticated) {
    return <div>Cargando...</div>;
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMensaje(''); // Limpiar mensajes al cambiar de tab
    
    // Actualizar breadcrumb según la sección
    const breadcrumbs = {
      'navegacion': ['Dashboard', 'Seminarista'],
      'eventos': ['Dashboard', 'Seminarista', 'Eventos'],
      'cabanas': ['Dashboard', 'Seminarista', 'Cabañas'],
      'mis-inscripciones': ['Dashboard', 'Seminarista', 'Mis Inscripciones'],
      'mis-reservas': ['Dashboard', 'Seminarista', 'Mis Reservas'],
      'mis-solicitudes': ['Dashboard', 'Seminarista', 'Mis Solicitudes'],
      'crear-solicitud': ['Dashboard', 'Seminarista', 'Nueva Solicitud']
    };
    setBreadcrumbPath(breadcrumbs[tabId] || ['Dashboard', 'Seminarista']);
  };

  const handleReservar = (cabana) => {
    setCabanaSeleccionada(cabana);
    setMostrarFormularioReserva(true);
  };

  const handleSuccess = (mensaje, tipo = 'success') => {
    setMensaje(mensaje);
    setMensajeTipo(tipo);
    setTimeout(() => {
      setMensaje('');
      setMensajeTipo('info');
    }, 5000);
  };

  const handleError = (mensaje) => {
    handleSuccess(mensaje, 'error');
  };

  const handleModificarPerfil = () => {
    setMostrarModificarPerfil(true);
  };

  const closeMensaje = () => {
    setMensaje('');
    setMensajeTipo('info');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'eventos':
        return (
          <div className="seccion-usuarios">
            <div className="seccion-header">
              <h2>📅 Eventos Disponibles</h2>
              <button 
                className="btn-secondary"
                onClick={() => setActiveTab('navegacion')}
              >
                ← Volver al Panel
              </button>
            </div>
            <EventosNavegables onSuccess={handleSuccess} />
          </div>
        );
      
      case 'cabanas':
        return (
          <div className="seccion-usuarios">
            <div className="seccion-header">
              <h2>🏠 Cabañas Disponibles</h2>
              <button 
                className="btn-secondary"
                onClick={() => setActiveTab('navegacion')}
              >
                ← Volver al Panel
              </button>
            </div>
            <CabanasNavegables onReservar={handleReservar} />
          </div>
        );
      
      case 'mis-inscripciones':
        return (
          <div className="seccion-usuarios">
            <div className="seccion-header">
              <h2>📝 Mis Inscripciones</h2>
              <button 
                className="btn-secondary"
                onClick={() => setActiveTab('navegacion')}
              >
                ← Volver al Panel
              </button>
            </div>
            <InscripcionTablaContainer 
              userRole="seminarista"
              readOnly={false}
              canCreate={true}
              canEdit={false}
              canDelete={false}
              filtroUsuario={true}
            />
          </div>
        );
      
      case 'mis-reservas':
        return (
          <div className="seccion-usuarios">
            <div className="seccion-header">
              <h2>🗓️ Mis Reservas</h2>
              <button 
                className="btn-secondary"
                onClick={() => setActiveTab('navegacion')}
              >
                ← Volver al Panel
              </button>
            </div>
            <ReservaTablaContainer 
              userRole="seminarista"
              readOnly={false}
              canCreate={true}
              canEdit={false}
              canDelete={false}
              filtroUsuario={true}
            />
          </div>
        );
      
      case 'mis-solicitudes':
        return (
          <div className="seccion-usuarios">
            <div className="seccion-header">
              <h2>📋 Mis Solicitudes</h2>
              <button 
                className="btn-secondary"
                onClick={() => setActiveTab('navegacion')}
              >
                ← Volver al Panel
              </button>
            </div>
            <SolicitudTabla 
              userRole="seminarista"
              readOnly={false}
              canCreate={true}
              canEdit={false}
              canDelete={false}
              filtroUsuario={true}
            />
          </div>
        );
      
      case 'crear-solicitud':
        return (
          <div className="seccion-usuarios">
            <div className="seccion-header">
              <h2>➕ Nueva Solicitud</h2>
              <button 
                className="btn-secondary"
                onClick={() => setActiveTab('navegacion')}
              >
                ← Volver al Panel
              </button>
            </div>
            <div className="alert" style={{ marginBottom: '20px' }}>
              <h3>Crear nueva solicitud</h3>
              <p>Presiona el botón para crear una nueva solicitud al administrador</p>
            </div>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <button 
                className="btn-primary"
                onClick={() => setModalOpen(true)}
                style={{ fontSize: '1.1rem', padding: '16px 32px' }}
              >
                ➕ Crear Nueva Solicitud
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <DashboardOverview 
            onTabChange={handleTabChange}
            onReservar={handleReservar}
            user={user}
          />
        );
    }
  };

  return (
    <div className="dashboard-contenedor">
      {/* Header Component */}
      <Header 
        user={user}
        breadcrumbPath={breadcrumbPath}
        onTabChange={handleTabChange}
      />

      {/* Notification Banner */}
      <NotificationBanner 
        message={mensaje}
        type={mensajeTipo}
        onClose={closeMensaje}
      />

      {/* Main Content */}
      <div className="contenido">
        {renderContent()}
        
        {/* Modal para crear solicitud */}
        {modalOpen && (
          <SolicitudModal
            onClose={() => setModalOpen(false)}
            onSubmit={(data) => {
              console.log('Nueva solicitud:', data);
              setModalOpen(false);
              handleSuccess('Solicitud creada exitosamente');
            }}
            userRole="seminarista"
          />
        )}

        {/* Modal de reserva */}
        {mostrarFormularioReserva && (
          <FormularioReserva
            cabana={cabanaSeleccionada}
            onClose={() => {
              setMostrarFormularioReserva(false);
              setCabanaSeleccionada(null);
            }}
            onSuccess={handleSuccess}
          />
        )}

        {/* Modal de modificar perfil */}
        {mostrarModificarPerfil && (
          <ModificarPerfil
            onClose={() => setMostrarModificarPerfil(false)}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardSeminarista;
