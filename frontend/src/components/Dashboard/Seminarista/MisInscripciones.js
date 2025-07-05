import React, { useEffect, useState } from 'react';
import { inscripcionService } from '../../../services/inscripcionService';
import './MisInscripciones.css';

const MisInscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const data = await inscripcionService.getMisInscripciones();
        let inscripcionesArray = [];
        if (Array.isArray(data)) {
          inscripcionesArray = data;
        } else if (data && Array.isArray(data.inscripciones)) {
          inscripcionesArray = data.inscripciones;
        } else if (data && Array.isArray(data.data)) {
          inscripcionesArray = data.data;
        }
        setInscripciones(inscripcionesArray);
      } catch (err) {
        setError('No se pudieron cargar tus inscripciones.');
      } finally {
        setLoading(false);
      }
    };
    fetchInscripciones();
  }, []);

  return (
    <div className="seccion-inscripciones">
      <h2>Mis Inscripciones</h2>
      {loading && <p>Cargando inscripciones...</p>}
      {error && <p style={{color:'#f472b6'}}>{error}</p>}
      {!loading && !error && (
        <ul className="lista-inscripciones">
          {inscripciones.length === 0 ? (
            <li>No tienes inscripciones.</li>
          ) : (
            inscripciones.map(insc => (
              <li key={insc._id} className="inscripcion-item">
                <div className="inscripcion-imgbox">
                  <img
                    src={insc.evento?.imagenUrl || insc.evento?.imagen || '/images/default-inscripcion.svg'}
                    alt={insc.evento?.nombre || 'Evento'}
                    className="inscripcion-img"
                  />
                </div>
                <div className="inscripcion-info">
                  <span className="inscripcion-evento">Evento: {insc.evento?.nombre || insc.evento}</span>
                  <span className="inscripcion-estado">Estado: {insc.estado}</span>
                  <span className="inscripcion-fecha">Fecha: {insc.evento?.fechaEvento ? new Date(insc.evento.fechaEvento).toLocaleDateString() : ''}</span>
                  <span className="inscripcion-horario">Horario: {insc.evento?.horaInicio} - {insc.evento?.horaFin}</span>
                  <span className="inscripcion-precio">Precio: {insc.evento?.precio ? `$${insc.evento.precio.toLocaleString()}` : 'Gratis'}</span>
                  <span className="inscripcion-cupos">Cupos: {insc.evento?.cuposDisponibles ?? '-'} / {insc.evento?.cuposTotales ?? '-'}</span>
                  <span className="inscripcion-lugar">Lugar: {insc.evento?.lugar}</span>
                  <span className="inscripcion-direccion">Dirección: {insc.evento?.direccion}</span>
                  <span className="inscripcion-etiquetas">{insc.evento?.etiquetas?.length ? `Etiquetas: ${insc.evento.etiquetas.join(', ')}` : ''}</span>
                  {insc.evento?.programa && Array.isArray(insc.evento.programa) && insc.evento.programa.length > 0 && (
                    <details className="inscripcion-programa">
                      <summary>Ver programa</summary>
                      <ul>
                        {insc.evento.programa.map((p, idx) => (
                          <li key={idx}>
                            <strong>{p.horaInicio} - {p.horaFin}:</strong> {p.tema}<br/>
                            <span>{p.descripcion}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                  <span className="inscripcion-observaciones">{insc.evento?.observaciones}</span>
                  <span className="inscripcion-creada">Inscripción realizada: {insc.createdAt ? new Date(insc.createdAt).toLocaleString() : '-'}</span>
                  <span className="inscripcion-actualizada">Última actualización: {insc.updatedAt ? new Date(insc.updatedAt).toLocaleString() : '-'}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default MisInscripciones;
