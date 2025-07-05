import React, { useEffect, useState } from 'react';
import { cabanaService } from '../../../services/cabanaService';
import { useAuthCheck } from '../../../hooks/useAuthCheck';
import './CabanasNavegables.css';
import FormularioReserva from '../FormularioReserva';

const CabanasNavegables = () => {
  const [cabanas, setCabanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const { user } = useAuthCheck('seminarista');

  useEffect(() => {
    const fetchCabanas = async () => {
      try {
        const data = await cabanaService.getAll();
        let cabanasArray = [];
        if (Array.isArray(data)) {
          cabanasArray = data;
        } else if (data && Array.isArray(data.cabanas)) {
          cabanasArray = data.cabanas;
        } else if (data && Array.isArray(data.data)) {
          cabanasArray = data.data;
        }
        setCabanas(cabanasArray);
      } catch (err) {
        setError('No se pudieron cargar las cabañas.');
      } finally {
        setLoading(false);
      }
    };
    fetchCabanas();
  }, []);

  const handleReservar = (cabana) => {
    setCabanaSeleccionada(cabana);
  };

  return (
    <div className="seccion-cabanas">
      <h2>Cabañas Disponibles</h2>
      {loading && <p>Cargando cabañas...</p>}
      {error && <p style={{color:'#f472b6'}}>{error}</p>}
      {!loading && !error && (
        <ul className="lista-cabanas">
          {cabanas.length === 0 ? (
            <li>No hay cabañas disponibles.</li>
          ) : (
            cabanas.map(cab => (
              <li key={cab._id} className="cabana-item">
                <div className="cabana-imgbox">
                  <img
                    src={cab.imagenUrl || '/images/default-cabin.svg'}
                    alt={cab.nombre}
                    className="cabana-img"
                  />
                </div>
                <span className="cabana-nombre">{cab.nombre}</span>
                <span className="cabana-ubicacion">{typeof cab.ubicacion === 'string' ? cab.ubicacion : cab.ubicacion?.nombre || '-'}</span>
                <span className="cabana-descripcion">{cab.descripcion}</span>
                <span className="cabana-precio">Precio por noche: {cab.precio ? `$${cab.precio.toLocaleString()}` : 'Consultar'}</span>
                <span className="cabana-cupos">Cupos: {cab.cuposDisponibles ?? '-'} / {cab.cuposTotales ?? '-'}</span>
                <span className="cabana-etiquetas">{Array.isArray(cab.etiquetas) ? `Etiquetas: ${cab.etiquetas.map(e => typeof e === 'string' ? e : e?.nombre || '').filter(Boolean).join(', ')}` : ''}</span>
                <div className="cabana-actions">
                  <button className="cabana-btn" onClick={() => handleReservar(cab)}>Reservar</button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
      {cabanaSeleccionada && (
        <FormularioReserva
          cabana={cabanaSeleccionada}
          onClose={() => setCabanaSeleccionada(null)}
          onSuccess={(msg) => {
            setFeedback(msg);
            setCabanaSeleccionada(null);
            setTimeout(() => setFeedback(null), 3500);
          }}
        />
      )}
      {feedback && (
        <div className="feedback-reserva-exito">{feedback}</div>
      )}
    </div>
  );
};

export default CabanasNavegables;
