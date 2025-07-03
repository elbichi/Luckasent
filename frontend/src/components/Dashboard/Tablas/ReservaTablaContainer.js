import React, { useState, useEffect } from 'react';
import { reservaService } from '../../../services/reservaService';
import TablaReservas from './ReservaTabla';

const ReservaTablaContainer = ({ userRole, readOnly, canCreate, canEdit, canDelete, filtroUsuario }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener información del usuario actual
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    cargarReservas();
  }, [filtroUsuario]);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      // Si filtroUsuario es true, usar el endpoint específico para mis reservas
      if (filtroUsuario) {
        response = await reservaService.getMisReservas();
      } else {
        response = await reservaService.getAllReservas();
      }
      
      if (response.success) {
        setReservas(response.data);
        console.log('Reservas cargadas:', response.data.length);
      } else {
        setError(response.message || 'Error al cargar reservas');
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (reserva) => {
    // Lógica para editar reserva
    console.log('Editar reserva:', reserva);
  };

  const handleEliminar = async (reservaId) => {
    if (window.confirm('¿Está seguro de eliminar esta reserva?')) {
      try {
        const response = await reservaService.deleteReserva(reservaId);
        if (response.success) {
          cargarReservas(); // Recargar las reservas
        } else {
          alert('Error al eliminar la reserva');
        }
      } catch (error) {
        console.error('Error al eliminar reserva:', error);
        alert('Error al eliminar la reserva');
      }
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Cargando reservas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={cargarReservas} className="btn-retry">
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="reserva-tabla-container">
      {filtroUsuario && (
        <div className="info-header">
          <h3>🗓️ Mis Reservas</h3>
          <p>Aquí puedes ver todas las reservas que has realizado para las cabañas.</p>
        </div>
      )}
      
      {reservas.length === 0 ? (
        <div className="no-reservas">
          <div className="no-data-message">
            <h4>No hay reservas</h4>
            <p>
              {filtroUsuario 
                ? 'Aún no has realizado ninguna reserva. ¡Explora las cabañas disponibles!' 
                : 'No hay reservas registradas en el sistema.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="reservas-grid">
          {reservas.map(reserva => (
            <div key={reserva._id} className="reserva-card">
              <div className="reserva-header">
                <h4>{reserva.cabana?.nombre || 'Cabaña no especificada'}</h4>
                <span className={`estado-badge ${reserva.estado?.toLowerCase() || 'pendiente'}`}>
                  {reserva.estado || 'Pendiente'}
                </span>
              </div>
              
              <div className="reserva-info">
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <span className="info-text">
                    <strong>Inicio:</strong> {formatearFecha(reserva.fechaInicio)}
                  </span>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <span className="info-text">
                    <strong>Fin:</strong> {formatearFecha(reserva.fechaFin)}
                  </span>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">👥</span>
                  <span className="info-text">
                    <strong>Capacidad:</strong> {reserva.cabana?.capacidad || 'N/A'}
                  </span>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <span className="info-text">
                    <strong>Ubicación:</strong> {reserva.cabana?.ubicacion || 'N/A'}
                  </span>
                </div>
              </div>

              {reserva.observaciones && (
                <div className="reserva-observaciones">
                  <strong>Observaciones:</strong>
                  <p>{reserva.observaciones}</p>
                </div>
              )}

              <div className="reserva-actions">
                {canEdit && (
                  <button 
                    className="btn-editar"
                    onClick={() => handleEditar(reserva)}
                  >
                    ✏️ Editar
                  </button>
                )}
                
                {canDelete && (
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleEliminar(reserva._id)}
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservaTablaContainer;
