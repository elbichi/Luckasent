import React, { useEffect, useState } from 'react';
import { solicitudService } from '../../../services/solicirudService';
import './MisSolicitudes.css';

const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const data = await solicitudService.getMisSolicitudes();
        let solicitudesArray = [];
        if (Array.isArray(data)) {
          solicitudesArray = data;
        } else if (data && Array.isArray(data.solicitudes)) {
          solicitudesArray = data.solicitudes;
        } else if (data && Array.isArray(data.data)) {
          solicitudesArray = data.data;
        }
        setSolicitudes(solicitudesArray);
      } catch (err) {
        setError('No se pudieron cargar tus solicitudes.');
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitudes();
  }, []);

  return (
    <div className="seccion-solicitudes">
      <h2>Mis Solicitudes</h2>
      {loading && <p>Cargando solicitudes...</p>}
      {error && <p style={{color:'#f472b6'}}>{error}</p>}
      {!loading && !error && (
        <ul className="lista-solicitudes">
          {solicitudes.length === 0 ? (
            <li>No tienes solicitudes.</li>
          ) : (
            solicitudes.map(sol => (
              <li key={sol._id} className="solicitud-item">
                <div className="solicitud-imgbox">
                  <img
                    src={'/images/default-request.svg'}
                    alt={sol.tipo}
                    className="solicitud-img"
                  />
                </div>
                <div className="solicitud-info">
                  <span className="solicitud-tipo">Tipo: {sol.tipo}</span>
                  <span className="solicitud-estado">Estado: {sol.estado}</span>
                  <span className="solicitud-fecha">Fecha: {sol.fecha ? new Date(sol.fecha).toLocaleDateString() : ''}</span>
                  <span className="solicitud-detalle">{sol.detalle}</span>
                  <span className="solicitud-observaciones">{sol.observaciones}</span>
                  <span className="solicitud-creada">Solicitud realizada: {sol.createdAt ? new Date(sol.createdAt).toLocaleString() : '-'}</span>
                  <span className="solicitud-actualizada">Última actualización: {sol.updatedAt ? new Date(sol.updatedAt).toLocaleString() : '-'}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default MisSolicitudes;
