import React, { useEffect, useState } from 'react';
import { useAuthCheck } from '../../../hooks/useAuthCheck';
import { eventService } from '../../../services/eventService';
import { inscripcionService } from '../../../services/inscripcionService';
import './EventosNavegables.css';

const EventosNavegables = () => {
  const { user } = useAuthCheck('seminarista');
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [inscripcionMsg, setInscripcionMsg] = useState(null);
  const [inscripcionLoading, setInscripcionLoading] = useState(false);
  const [misInscripciones, setMisInscripciones] = useState([]);

  useEffect(() => {
    const fetchEventosEInscripciones = async () => {
      try {
        const [eventosData, inscripcionesData] = await Promise.all([
          eventService.getAllEvents(),
          inscripcionService.getMisInscripciones()
        ]);

        let eventosArray = [];
        if (Array.isArray(eventosData)) {
          eventosArray = eventosData;
        } else if (eventosData && Array.isArray(eventosData.eventos)) {
          eventosArray = eventosData.eventos;
        } else if (eventosData && Array.isArray(eventosData.data)) {
          eventosArray = eventosData.data;
        }

        let inscripcionesArray = [];
        if (Array.isArray(inscripcionesData)) {
          inscripcionesArray = inscripcionesData;
        } else if (inscripcionesData && Array.isArray(inscripcionesData.data)) {
          inscripcionesArray = inscripcionesData.data;
        }

        setEventos(eventosArray);
        setMisInscripciones(inscripcionesArray);
      } catch (err) {
        setError('No se pudieron cargar los eventos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventosEInscripciones();
  }, []);

  const estaInscrito = (eventoId) => {
    return misInscripciones.some(insc => insc.evento === eventoId || insc.evento?._id === eventoId);
  };

  const handleInscribir = (evento) => {
    if (estaInscrito(evento._id)) {
      setInscripcionMsg('Ya estás inscrito en este evento.');
      return;
    }
    setEventoSeleccionado(evento);
  };

  const handleSubmitInscripcion = async (e) => {
    e.preventDefault();
    setInscripcionMsg(null);
    setInscripcionLoading(true);
    const form = e.target;

    try {
      const nuevaInscripcion = {
        usuario: user._id,
        evento: eventoSeleccionado._id,
        categoria: form.categoria.value || eventoSeleccionado.categoria,
        nombre: form.nombre.value,
        apellido: form.apellido.value,
        tipoDocumento: form.tipoDocumento.value,
        numeroDocumento: form.numeroDocumento.value,
        correo: form.correo.value,
        telefono: form.telefono.value,
        edad: parseInt(form.edad.value),
        observaciones: form.observaciones.value || undefined
      };

      const response = await inscripcionService.create(nuevaInscripcion);
      
      // Actualizar la lista de inscripciones
      setMisInscripciones(prev => [...prev, response.data || response]);
      
      setInscripcionMsg('¡Inscripción exitosa!');
      setTimeout(() => {
        setEventoSeleccionado(null);
        setInscripcionMsg(null);
      }, 1800);
    } catch (err) {
      console.error('Error al inscribirse:', err);
      setInscripcionMsg('Error al inscribirse. Intenta de nuevo.');
    } finally {
      setInscripcionLoading(false);
    }
  };

  return (
    <div className="seccion-eventos">
      <h2>Eventos del Seminario</h2>
      {loading && <p>Cargando eventos...</p>}
      {error && <p style={{color:'#f472b6'}}>{error}</p>}
      {!loading && !error && (
        <>
        <ul className="lista-eventos">
          {eventos.length === 0 ? (
            <li>No hay eventos disponibles.</li>
          ) : (
            eventos.map(ev => {
              const inscrito = estaInscrito(ev._id);
              return (
                <li key={ev._id} className="evento-item">
                  <div className="evento-imgbox">
                    <img
                      src={ev.images || ev.imagenUrl || ev.imagen || '/images/default-event.svg'}
                      alt={ev.name}
                      className="evento-img"
                    />
                  </div>
                  <div className="evento-info">
                    <span className="evento-titulo">{ev.name}</span>
                    <span className="evento-descripcion">{ev.description}</span>
                    <span className="evento-precio">Precio: {ev.price === 0 ? 'Gratis' : `$${ev.price?.toLocaleString()}`}</span>
                    <span className="evento-categoria">Categoría: {ev.categoria?.nombre || ev.categoria || '-'}</span>
                    {ev.etiquetas && ev.etiquetas.length > 0 && (
                      <span className="evento-etiquetas">Etiquetas: {ev.etiquetas.join(', ')}</span>
                    )}
                    <span className="evento-prioridad">Prioridad: {ev.prioridad}</span>
                    {ev.observaciones && (
                      <span className="evento-observaciones">Observaciones: {ev.observaciones}</span>
                    )}
                    {inscrito && (
                      <span className="evento-inscrito">✅ Ya estás inscrito</span>
                    )}
                  </div>
                  <div className="evento-actions">
                    <button 
                      className={`evento-btn ${inscrito ? 'inscrito' : ''}`}
                      onClick={() => handleInscribir(ev)}
                      disabled={inscrito}
                    >
                      {inscrito ? '✓ Inscrito' : 'Inscribirme'}
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
        {eventoSeleccionado && (
          <div className="modal-inscripcion">
            <div className="modal-content">
              <button className="close-modal" onClick={() => setEventoSeleccionado(null)}>&times;</button>
              <h3>Inscribirse a: {eventoSeleccionado.name}</h3>
              <div className="evento-modal-info">
                <strong>Nombre:</strong> {eventoSeleccionado.name}<br/>
                <strong>Descripción:</strong> {eventoSeleccionado.description}<br/>
                <strong>Precio:</strong> {eventoSeleccionado.price === 0 ? 'Gratis' : `$${eventoSeleccionado.price?.toLocaleString()}`}<br/>
                <strong>Observaciones:</strong> {eventoSeleccionado.observaciones || '-'}
              </div>
              <form onSubmit={handleSubmitInscripcion}>
                <input type="hidden" name="evento" value={eventoSeleccionado._id} />
                <input type="hidden" name="categoria" value={eventoSeleccionado.categoria?._id || eventoSeleccionado.categoria || ''} />
                <label>Nombre:*</label>
                <input type="text" name="nombre" defaultValue={user?.nombre || ''} required />
                <label>Apellido:*</label>
                <input type="text" name="apellido" defaultValue={user?.apellido || ''} required />
                <label>Tipo de documento:*</label>
                <select name="tipoDocumento" required defaultValue="">
                  <option value="">Selecciona...</option>
                  <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                  <option value="Cédula de extranjería">Cédula de extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                </select>
                <label>Número de documento:*</label>
                <input type="text" name="numeroDocumento" defaultValue={user?.numeroDocumento || ''} required />
                <label>Correo:*</label>
                <input type="email" name="correo" defaultValue={user?.email || ''} required />
                <label>Teléfono:*</label>
                <input type="tel" name="telefono" defaultValue={user?.telefono || ''} required />
                <label>Edad:*</label>
                <input type="number" name="edad" min="1" max="120" defaultValue={user?.edad || ''} required />
                <label>Observaciones:</label>
                <textarea name="observaciones" placeholder="¿Algo que quieras agregar?" />
                <button type="submit" className="evento-btn" disabled={inscripcionLoading}>
                  {inscripcionLoading ? 'Enviando...' : 'Confirmar inscripción'}
                </button>
                {inscripcionMsg && <div style={{marginTop:'1rem', color:'#5eead4', fontWeight:600}}>{inscripcionMsg}</div>}
              </form>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  );
};

export default EventosNavegables;
