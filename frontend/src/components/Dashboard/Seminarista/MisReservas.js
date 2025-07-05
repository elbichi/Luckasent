import React, { useEffect, useState } from 'react';
import { reservaService } from '../../../services/reservaService';
import './MisReservas.css';

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const data = await reservaService.getMisReservas();
        let reservasArray = [];
        if (Array.isArray(data)) {
          reservasArray = data;
        } else if (data && Array.isArray(data.reservas)) {
          reservasArray = data.reservas;
        } else if (data && Array.isArray(data.data)) {
          reservasArray = data.data;
        }
        setReservas(reservasArray);
      } catch (err) {
        setError('No se pudieron cargar tus reservas.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []);

  return (
    <div className="seccion-reservas">
      <h2>Mis Reservas</h2>
      {loading && <p>Cargando reservas...</p>}
      {error && <p style={{color:'#f472b6'}}>{error}</p>}
      {!loading && !error && (
        <ul className="lista-reservas">
          {reservas.length === 0 ? (
            <li>No tienes reservas.</li>
          ) : (
            reservas.map(res => (
              <li key={res._id} className="reserva-item">
                <div className="reserva-imgbox">
                  <img
                    src={res.cabana?.imagenUrl || '/images/default-cabin.svg'}
                    alt={res.cabana?.nombre || 'Cabaña'}
                    className="reserva-img"
                  />
                </div>
                <div className="reserva-info">
                  <span className="reserva-cabana">Cabaña: {res.cabana?.nombre || res.cabana}</span>
                  <span className="reserva-fecha">Fecha: {res.fecha ? new Date(res.fecha).toLocaleDateString() : ''}</span>
                  <span className="reserva-estado">Estado: {res.estado}</span>
                  <span className="reserva-precio">Precio: {res.precio ? `$${res.precio.toLocaleString()}` : (res.cabana?.precio ? `$${res.cabana.precio.toLocaleString()}` : 'Consultar')}</span>
                  <span className="reserva-cupos">Cupos: {res.cabana?.cuposDisponibles ?? '-'} / {res.cabana?.cuposTotales ?? '-'}</span>
                  <span className="reserva-ubicacion">Ubicación: {res.cabana?.ubicacion}</span>
                  <span className="reserva-etiquetas">{res.cabana?.etiquetas?.length ? `Etiquetas: ${res.cabana.etiquetas.join(', ')}` : ''}</span>
                  <span className="reserva-observaciones">{res.observaciones}</span>
                  <span className="reserva-creada">Reserva realizada: {res.createdAt ? new Date(res.createdAt).toLocaleString() : '-'}</span>
                  <span className="reserva-actualizada">Última actualización: {res.updatedAt ? new Date(res.updatedAt).toLocaleString() : '-'}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default MisReservas;
