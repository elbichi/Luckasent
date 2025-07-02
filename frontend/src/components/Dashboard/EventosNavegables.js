import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioInscripcion from './FormularioInscripcion';

const EventosNavegables = ({ onSuccess }) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrarFormularioInscripcion, setMostrarFormularioInscripcion] = useState(false);
  const [eventoParaInscripcion, setEventoParaInscripcion] = useState(null);

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Cargando eventos para seminarista...');
      const response = await axios.get('http://localhost:3000/api/eventos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 Respuesta del servidor:', response.data);
      if (response.data.success) {
        console.log('✅ Eventos cargados:', response.data.data.length);
        console.log('📋 Primer evento:', response.data.data[0]);
        setEventos(response.data.data);
      }
    } catch (error) {
      setError('Error al cargar eventos');
      console.error('❌ Error al cargar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const abrirFormularioInscripcion = (evento) => {
    setEventoParaInscripcion(evento);
    setMostrarFormularioInscripcion(true);
  };

  const cerrarFormularioInscripcion = () => {
    setMostrarFormularioInscripcion(false);
    setEventoParaInscripcion(null);
  };

  const manejarExitoInscripcion = (mensaje) => {
    if (onSuccess) {
      onSuccess(mensaje);
    } else {
      alert(mensaje);
    }
    cerrarFormularioInscripcion();
  };

  if (loading) return <div className="loading-eventos">Cargando eventos...</div>;
  if (error) return <div className="error-eventos">{error}</div>;

  return (
    <div className="eventos-navegables">
      <div className="eventos-grid">
        {eventos.map(evento => (
          <div key={evento._id} className="evento-card">
            {/* Imagen del evento */}
            <div className="evento-imagen">
              <img 
                src={evento.imagen || '/images/default-event.svg'} 
                alt={evento.nombre}
                onError={(e) => {
                  e.target.src = '/images/default-event.svg';
                }}
              />
            </div>
            
            <div className="evento-header">
              <h3>{evento.nombre}</h3>
              <span className={`evento-estado ${evento.active ? 'activo' : 'inactivo'}`}>
                {evento.active ? 'Disponible' : 'No disponible'}
              </span>
            </div>
            
            <div className="evento-info">
              <div className="info-item">
                <span className="info-icon">📅</span>
                <span className="info-text">{formatearFecha(evento.fechaEvento)}</span>
              </div>
              
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span className="info-text">{evento.lugar || 'Lugar por definir'}</span>
              </div>
              
              <div className="info-item">
                <span className="info-icon">👥</span>
                <span className="info-text">
                  {evento.cuposTotales ? `Capacidad: ${evento.cuposTotales}` : 'Sin límite'}
                </span>
              </div>
            </div>

            <div className="evento-descripcion">
              <p>{evento.descripcion || 'Sin descripción disponible'}</p>
            </div>

            <div className="evento-actions">
              <button 
                className="btn-ver-detalle"
                onClick={() => setEventoSeleccionado(evento)}
              >
                Ver Detalle
              </button>
              
              {evento.active && (
                <button 
                  className="btn-inscribirse"
                  onClick={() => abrirFormularioInscripcion(evento)}
                >
                  Inscribirse
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {eventos.length === 0 && (
        <div className="no-eventos">
          <h3>No hay eventos disponibles</h3>
          <p>Por el momento no hay eventos programados. Mantente atento para futuras actividades.</p>
        </div>
      )}

      {/* Modal de detalle del evento */}
      {eventoSeleccionado && (
        <div className="modal-overlay" onClick={() => setEventoSeleccionado(null)}>
          <div className="modal-detalle-evento" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{eventoSeleccionado.nombre}</h2>
              <button 
                className="btn-close"
                onClick={() => setEventoSeleccionado(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detalle-evento">
                <div className="detalle-item">
                  <strong>Fecha y Hora:</strong>
                  <span>{formatearFecha(eventoSeleccionado.fechaEvento)}</span>
                </div>
                
                <div className="detalle-item">
                  <strong>Lugar:</strong>
                  <span>{eventoSeleccionado.lugar || 'Por definir'}</span>
                </div>
                
                <div className="detalle-item">
                  <strong>Capacidad:</strong>
                  <span>{eventoSeleccionado.cuposTotales || 'Sin límite'}</span>
                </div>
                
                <div className="detalle-item">
                  <strong>Descripción:</strong>
                  <p>{eventoSeleccionado.descripcion || 'Sin descripción disponible'}</p>
                </div>
                
                <div className="detalle-item">
                  <strong>Estado:</strong>
                  <span className={`estado-badge ${eventoSeleccionado.active ? 'activo' : 'inactivo'}`}>
                    {eventoSeleccionado.active ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
              </div>
              
              {eventoSeleccionado.active && (
                <div className="modal-actions">
                  <button 
                    className="btn-inscribirse-modal"
                    onClick={() => {
                      abrirFormularioInscripcion(eventoSeleccionado);
                      setEventoSeleccionado(null);
                    }}
                  >
                    Inscribirse a este evento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario de inscripción */}
      {mostrarFormularioInscripcion && eventoParaInscripcion && (
        <FormularioInscripcion
          evento={eventoParaInscripcion}
          onClose={cerrarFormularioInscripcion}
          onSuccess={manejarExitoInscripcion}
        />
      )}
    </div>
  );
};

export default EventosNavegables;
