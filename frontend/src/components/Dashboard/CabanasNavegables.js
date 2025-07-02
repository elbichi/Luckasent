import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CabanasNavegables = ({ onReservar }) => {
  const [cabanas, setCabanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);

  useEffect(() => {
    cargarCabanas();
  }, []);

  const cargarCabanas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/cabanas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCabanas(response.data.data);
      }
    } catch (error) {
      setError('Error al cargar cabañas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    // Removemos emojis para un diseño más limpio
    return '';
  };

  if (loading) return <div className="loading-cabanas">Cargando cabañas...</div>;
  if (error) return <div className="error-cabanas">{error}</div>;

  return (
    <div className="cabanas-navegables">
      <div className="cabanas-grid">
        {cabanas.map(cabana => (
          <div key={cabana._id} className="cabana-card">
            {/* Imagen de la cabaña */}
            <div className="cabana-imagen">
              <img 
                src={cabana.imagen || '/images/default-cabin.svg'} 
                alt={cabana.nombre}
                onError={(e) => {
                  e.target.src = '/images/default-cabin.svg';
                }}
              />
            </div>
            
            <div className="cabana-header">
              <h3>{cabana.nombre}</h3>
              <span className={`cabana-estado estado-${cabana.estado?.toLowerCase()}`}>
                {cabana.estado === 'disponible' ? 'Disponible' : 
                 cabana.estado === 'ocupada' ? 'Ocupada' : 
                 cabana.estado === 'mantenimiento' ? 'Mantenimiento' : 
                 cabana.estado || 'Sin estado'}
              </span>
            </div>
            
            <div className="cabana-info">
              <div className="info-item">
                <span className="info-icon">👥</span>
                <span className="info-text">Capacidad: {cabana.capacidad || 'No especificada'}</span>
              </div>
              
              <div className="info-item">
                <span className="info-icon">💰</span>
                <span className="info-text">
                  $14,000/noche
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-icon">🏷️</span>
                <span className="info-text">
                  {cabana.categoria?.nombre || 'Sin categoría'}
                </span>
              </div>
            </div>

            <div className="cabana-descripcion">
              <p>{cabana.descripcion || 'Sin descripción disponible'}</p>
            </div>

            <div className="cabana-actions">
              <button 
                className="btn-ver-detalle"
                onClick={() => setCabanaSeleccionada(cabana)}
              >
                Ver Detalle
              </button>
              
              {cabana.estado?.toLowerCase() === 'disponible' && (
                <button 
                  className="btn-reservar"
                  onClick={() => onReservar(cabana)}
                >
                  Reservar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {cabanas.length === 0 && (
        <div className="no-cabanas">
          <h3>🏠 No hay cabañas disponibles</h3>
          <p>Por el momento no hay cabañas registradas.</p>
        </div>
      )}

      {/* Modal de detalle de cabaña */}
      {cabanaSeleccionada && (
        <div className="modal-overlay" onClick={() => setCabanaSeleccionada(null)}>
          <div className="modal-detalle-cabana" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{cabanaSeleccionada.nombre}</h2>
              <button 
                className="btn-close"
                onClick={() => setCabanaSeleccionada(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detalle-cabana">
                <div className="detalle-item">
                  <strong>👥 Capacidad:</strong>
                  <span>{cabanaSeleccionada.capacidad || 'No especificada'}</span>
                </div>
                
                <div className="detalle-item">
                  <strong>💰 Precio:</strong>
                  <span>$14,000/noche</span>
                </div>
                
                <div className="detalle-item">
                  <strong>🏷️ Categoría:</strong>
                  <span>{cabanaSeleccionada.categoria?.nombre || 'Sin categoría'}</span>
                </div>
                
                <div className="detalle-item">
                  <strong>📝 Descripción:</strong>
                  <p>{cabanaSeleccionada.descripcion || 'Sin descripción disponible'}</p>
                </div>
                
                <div className="detalle-item">
                  <strong>🔄 Estado:</strong>
                  <span className={`estado-badge estado-${cabanaSeleccionada.estado?.toLowerCase()}`}>
                    {getEstadoColor(cabanaSeleccionada.estado)} {cabanaSeleccionada.estado || 'Sin estado'}
                  </span>
                </div>

                {cabanaSeleccionada.servicios && (
                  <div className="detalle-item">
                    <strong>🛎️ Servicios:</strong>
                    <div className="servicios-list">
                      {cabanaSeleccionada.servicios.map((servicio, index) => (
                        <span key={index} className="servicio-tag">
                          {servicio}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {cabanaSeleccionada.estado?.toLowerCase() === 'disponible' && (
                <div className="modal-actions">
                  <button 
                    className="btn-reservar-modal"
                    onClick={() => {
                      onReservar(cabanaSeleccionada);
                      setCabanaSeleccionada(null);
                    }}
                  >
                    🗓️ Reservar esta cabaña
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CabanasNavegables;
