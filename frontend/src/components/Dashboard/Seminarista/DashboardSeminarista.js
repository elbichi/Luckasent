import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModificarPerfil from '../ModificarPerfil';
import { useAuthCheck } from '../../../hooks/useAuthCheck';

// Modular Components
import Header from '../Shared/Header';
import NotificationBanner from '../Shared/NotificationBanner';

import './DashboardSeminarista.css';

const DashboardSeminarista = () => {
  const navigate = useNavigate();
  const [mostrarModificarPerfil, setMostrarModificarPerfil] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('info');
  const breadcrumbPath = ['Dashboard', 'Seminarista'];
  
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

  const handleSuccess = (mensaje, tipo = 'success') => {
    setMensaje(mensaje);
    setMensajeTipo(tipo);
    setTimeout(() => {
      setMensaje('');
      setMensajeTipo('info');
    }, 5000);
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const closeMensaje = () => {
    setMensaje('');
    setMensajeTipo('info');
  };

  const renderContent = () => {
    return (
      <div className="seccion-bienvenida fade-in">
        <div className="bienvenida-header">
          <h1>
            ¡Bienvenido, <span className="text-accent">{user?.nombre || 'Seminarista'}</span>! 
          </h1>
          <p className="bienvenida-subtitle">
            Tu panel de control moderno y centralizado. Gestiona eventos, reservas de cabañas, 
            solicitudes y mantén un seguimiento completo de todas tus actividades seminariales 
            con estilo y eficiencia.
          </p>
        </div>
        
        <div className="status-cards slide-up">
          <div className="status-card">
            <div className="status-icon">🔒</div>
            <div className="status-info">
              <h3>Sistema Activo</h3>
              <p>Dashboard en línea</p>
              <span className="status-indicator">✓ Funcionando correctamente</span>
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-icon">🔐</div>
            <div className="status-info">
              <h3>Acceso Seguro</h3>
              <p>Autenticación verificada</p>
              <span className="status-indicator">✓ Protegido</span>
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-icon">⚡</div>
            <div className="status-info">
              <h3>Navegación Rápida</h3>
              <p>Acceso optimizado</p>
              <span className="status-indicator">✓ Listo para usar</span>
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-icon">📊</div>
            <div className="status-info">
              <h3>Recursos</h3>
              <p>Herramientas disponibles</p>
              <span className="status-indicator">✓ Todo disponible</span>
            </div>
          </div>
        </div>

        <div className="acciones-rapidas">
          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/eventos')}>
            <div className="accion-icon">🎉</div>
            <h3 className="accion-titulo">Eventos</h3>
            <p className="accion-descripcion">
              Explora y participa en eventos del seminario
            </p>
            <button className="accion-button">Explorar Eventos</button>
          </div>

          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/cabanas')}>
            <div className="accion-icon">🏘️</div>
            <h3 className="accion-titulo">Cabañas</h3>
            <p className="accion-descripcion">
              Descubre y reserva cabañas disponibles
            </p>
            <button className="accion-button">Ver Cabañas</button>
          </div>

          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/mis-inscripciones')}>
            <div className="accion-icon">📝</div>
            <h3 className="accion-titulo">Mis Inscripciones</h3>
            <p className="accion-descripcion">
              Revisa tus inscripciones a eventos
            </p>
            <button className="accion-button">Ver Inscripciones</button>
          </div>

          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/mis-reservas')}>
            <div className="accion-icon">🏠</div>
            <h3 className="accion-titulo">Mis Reservas</h3>
            <p className="accion-descripcion">
              Gestiona tus reservas de cabañas
            </p>
            <button className="accion-button">Ver Reservas</button>
          </div>

          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/mis-solicitudes')}>
            <div className="accion-icon">📋</div>
            <h3 className="accion-titulo">Mis Solicitudes</h3>
            <p className="accion-descripcion">
              Consulta el estado de tus solicitudes
            </p>
            <button className="accion-button">Ver Solicitudes</button>
          </div>

          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/nueva-solicitud')}>
            <div className="accion-icon">✨</div>
            <h3 className="accion-titulo">Nueva Solicitud</h3>
            <p className="accion-descripcion">
              Crea una nueva solicitud
            </p>
            <button className="accion-button">Crear Solicitud</button>
          </div>
        </div>
      </div>
    );
  };

  if (mostrarModificarPerfil) {
    return (
      <div className="dashboard-contenedor">
        <Header 
          userRole="seminarista" 
          userName={user?.nombre}
          breadcrumbPath={breadcrumbPath}
        />
        
        <main className="main-content">
          <ModificarPerfil 
            onClose={() => setMostrarModificarPerfil(false)}
            onSuccess={handleSuccess}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-contenedor">
      <Header 
        userRole="seminarista" 
        userName={user?.nombre}
        breadcrumbPath={breadcrumbPath}
      />
      
      {mensaje && (
        <NotificationBanner 
          message={mensaje}
          type={mensajeTipo}
          onClose={closeMensaje}
        />
      )}
      
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardSeminarista;
