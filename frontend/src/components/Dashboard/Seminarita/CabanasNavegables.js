import React, { useEffect, useState } from 'react';
import { useAuthCheck } from '../../../hooks/useAuthCheck';
import { cabanaService } from '../../../services/cabanaService';
import './CabanasNavegables.css';

const CabanasNavegables = () => {
  const { user } = useAuthCheck('seminarista');
  const [cabanas, setCabanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCabanas = async () => {
      try {
        const data = await cabanaService.getAll();
        setCabanas(data);
      } catch (err) {
        setError('No se pudieron cargar las cabañas.');
      } finally {
        setLoading(false);
      }
    };
    fetchCabanas();
  }, []);

  return (
    <div className="seccion-cabanas">
      <h2>Cabañas Disponibles</h2>
      <div className="usuario-datos-evento">
        <strong>Usuario:</strong> {user?.nombre || 'Seminarista'}<br />
        <strong>Email:</strong> {user?.email || '-'}
      </div>
      {loading && <p>Cargando cabañas...</p>}
      {error && <p style={{color:'#f472b6'}}>{error}</p>}
      {!loading && !error && (
        <ul className="lista-cabanas">
          {cabanas.length === 0 ? (
            <li>No hay cabañas disponibles.</li>
          ) : (
            cabanas.map(cb => (
              <li key={cb._id} className="cabana-item">
                <span className="cabana-nombre">{cb.nombre}</span>
                <span className="cabana-ubicacion">{cb.ubicacion}</span>
                <span className="cabana-descripcion">{cb.descripcion}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default CabanasNavegables;
