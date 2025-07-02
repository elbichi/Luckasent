import React, { useState } from 'react';
import NavegacionSeminarista from './NavegacionSeminarista';
import EventosNavegables from './EventosNavegables';
import CabanasNavegables from './CabanasNavegables';
import FormularioReserva from './FormularioReserva';
import ModificarPerfil from './ModificarPerfil';
import InscripcionTabla from './Tablas/InscripcionTabla';
import ReservaTabla from './Tablas/ReservaTabla';
import SolicitudTabla from './Tablas/SolicitudTabla';
import SolicitudModal from './Modales/SolicitudModal';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import './Dashboard.css';

const DashboardSeminarista = () => {
  const [activeTab, setActiveTab] = useState('navegacion');
  const [modalOpen, setModalOpen] = useState(false);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [mostrarFormularioReserva, setMostrarFormularioReserva] = useState(false);
  const [mostrarModificarPerfil, setMostrarModificarPerfil] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  // Verificar autenticación y rol
  const { isAuthenticated, user } = useAuthCheck('seminarista');

  // Si no está autenticado, el hook se encarga de la redirección
  if (!isAuthenticated) {
    return <div>Cargando...</div>;
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMensaje(''); // Limpiar mensajes al cambiar de tab
  };

  const handleReservar = (cabana) => {
    setCabanaSeleccionada(cabana);
    setMostrarFormularioReserva(true);
  };

  const handleSuccess = (mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje(''), 5000); // Limpiar mensaje después de 5 segundos
  };

  const handleModificarPerfil = () => {
    setMostrarModificarPerfil(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'eventos':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>📅 Eventos Disponibles</h2>
              <button 
                className="btn-back"
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
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>🏠 Cabañas Disponibles</h2>
              <button 
                className="btn-back"
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
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>📝 Mis Inscripciones</h2>
              <button 
                className="btn-back"
                onClick={() => setActiveTab('navegacion')}
              >
                ← Volver al Panel
              </button>
            </div>
            <InscripcionTabla 
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
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>🗓️ Mis Reservas</h2>
              <button 
                className="btn-back"
                onClick={() => setActiveTab('navegacion')}
              >
                ← Volver al Panel
              </button>
            </div>
            <ReservaTabla 
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
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>📋 Mis Solicitudes</h2>
              <button 
                className="btn-back"
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
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>➕ Nueva Solicitud</h2>
              <button 
                className="btn-back"
                onClick={() => setActiveTab('navegacion')}
              >
                ← Volver al Panel
              </button>
            </div>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <button 
                className="btn-primary"
                onClick={() => setModalOpen(true)}
                style={{ fontSize: '1.2rem', padding: '15px 30px' }}
              >
                ➕ Crear Nueva Solicitud
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <NavegacionSeminarista 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            onModificarPerfil={handleModificarPerfil}
          />
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-seminarista">
      {/* Barra superior */}
      <div className="top-bar">
        <div className="user-info">
          <span className="welcome-text">
            Bienvenido, <strong>{user.nombre} {user.apellido}</strong>
          </span>
          <span className="role-badge">Seminarista</span>
        </div>
        <div className="top-actions">
          <button className="btn-perfil" onClick={handleModificarPerfil}>
            👤 Mi Perfil
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Mensaje de éxito/error */}
      {mensaje && (
        <div className="mensaje-exito">
          ✅ {mensaje}
        </div>
      )}

      {/* Contenido principal */}
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
  );
};

export default DashboardSeminarista;
