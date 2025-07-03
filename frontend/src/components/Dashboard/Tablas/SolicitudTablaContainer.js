import React, { useState, useEffect } from 'react';
import { solicitudService } from '../../../services/solicirudService';

const SolicitudTablaContainer = ({ userRole, readOnly, canCreate, canEdit, canDelete, filtroUsuario }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener información del usuario actual
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    cargarSolicitudes();
  }, [filtroUsuario]);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      // Si filtroUsuario es true, usar el endpoint específico para mis solicitudes
      if (filtroUsuario) {
        response = await solicitudService.getMisSolicitudes();
      } else {
        response = await solicitudService.getAllSolicitudes();
      }
      
      if (response.success) {
        setSolicitudes(response.data);
        console.log('Solicitudes cargadas:', response.data.length);
      } else {
        setError(response.message || 'Error al cargar solicitudes');
      }
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (solicitud) => {
    // Lógica para editar solicitud
    console.log('Editar solicitud:', solicitud);
  };

  const handleEliminar = async (solicitudId) => {
    if (window.confirm('¿Está seguro de eliminar esta solicitud?')) {
      try {
        const response = await solicitudService.deleteSolicitud(solicitudId);
        if (response.success) {
          cargarSolicitudes(); // Recargar las solicitudes
        } else {
          alert('Error al eliminar la solicitud');
        }
      } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        alert('Error al eliminar la solicitud');
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

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'pendiente';
      case 'en proceso': case 'en_proceso': return 'en-proceso';
      case 'completada': case 'aprobada': return 'completada';
      case 'rechazada': case 'cancelada': return 'rechazada';
      default: return 'pendiente';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad?.toLowerCase()) {
      case 'alta': return 'alta';
      case 'media': return 'media';
      case 'baja': return 'baja';
      default: return 'media';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Cargando solicitudes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={cargarSolicitudes} className="btn-retry">
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="solicitud-tabla-container">
      {filtroUsuario && (
        <div className="info-header">
          <h3>📋 Mis Solicitudes</h3>
          <p>Aquí puedes ver todas las solicitudes que has realizado al seminario.</p>
        </div>
      )}
      
      {solicitudes.length === 0 ? (
        <div className="no-solicitudes">
          <div className="no-data-message">
            <h4>No hay solicitudes</h4>
            <p>
              {filtroUsuario 
                ? 'Aún no has realizado ninguna solicitud. ¡Puedes crear una nueva solicitud cuando lo necesites!' 
                : 'No hay solicitudes registradas en el sistema.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="solicitudes-grid">
          {solicitudes.map(solicitud => (
            <div key={solicitud._id} className="solicitud-card">
              <div className="solicitud-header">
                <h4>{solicitud.tipoSolicitud || 'Solicitud'}</h4>
                <div className="badges-container">
                  <span className={`estado-badge ${getEstadoColor(solicitud.estado)}`}>
                    {solicitud.estado || 'Pendiente'}
                  </span>
                  <span className={`prioridad-badge ${getPrioridadColor(solicitud.prioridad)}`}>
                    {solicitud.prioridad || 'Media'}
                  </span>
                </div>
              </div>
              
              <div className="solicitud-info">
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <span className="info-text">
                    <strong>Fecha:</strong> {formatearFecha(solicitud.fechaSolicitud)}
                  </span>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">📂</span>
                  <span className="info-text">
                    <strong>Categoría:</strong> {solicitud.categoria?.nombre || 'Sin categoría'}
                  </span>
                </div>
                
                {solicitud.responsableAsignado && (
                  <div className="info-item">
                    <span className="info-icon">👤</span>
                    <span className="info-text">
                      <strong>Responsable:</strong> {solicitud.responsableAsignado.nombre} {solicitud.responsableAsignado.apellido}
                    </span>
                  </div>
                )}
                
                {solicitud.fechaRespuesta && (
                  <div className="info-item">
                    <span className="info-icon">✅</span>
                    <span className="info-text">
                      <strong>Fecha de respuesta:</strong> {formatearFecha(solicitud.fechaRespuesta)}
                    </span>
                  </div>
                )}
              </div>

              {solicitud.descripcion && (
                <div className="solicitud-descripcion">
                  <strong>Descripción:</strong>
                  <p>{solicitud.descripcion}</p>
                </div>
              )}

              {solicitud.respuesta && (
                <div className="solicitud-respuesta">
                  <strong>Respuesta:</strong>
                  <p>{solicitud.respuesta}</p>
                </div>
              )}

              <div className="solicitud-actions">
                {canEdit && (
                  <button 
                    className="btn-editar"
                    onClick={() => handleEditar(solicitud)}
                  >
                    ✏️ Editar
                  </button>
                )}
                
                {canDelete && (
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleEliminar(solicitud._id)}
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

export default SolicitudTablaContainer;
