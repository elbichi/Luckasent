import React from "react";

const EventoModal= ({
  mostrar,
  modoEdicion,
  eventoSeleccionado,
  setEventoSeleccionado,
  nuevoEvento,
  setNuevoEvento,
  categorias,
  onClose,
  onSubmit
    }) => {
    if (!mostrar) return null;
    
    return (
        <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Evento" : "Crear Nuevo Evento"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grupo">
            <label>Categorias:</label>
            <select
              type="text"
              value={modoEdicion ? eventoSeleccionado?.titulo : nuevoEvento.titulo}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, titulo: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })
              }
              placeholder="Título del evento"
              required
            >
              <option value="">Seleccione...</option>
              {categorias && categorias.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombre}
                </option>
              ))}
             </select>
          </div>
          <div className="form-grupo">
            <label>Título:</label>
            <input
              type="text"
              value={modoEdicion ? eventoSeleccionado?.titulo : nuevoEvento.titulo}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, titulo: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })
              }
              placeholder="Título del evento"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Descripción:</label>
            <input
              type="text"
              value={modoEdicion ? eventoSeleccionado?.descripcion : nuevoEvento.descripcion}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, descripcion: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })
              }
              placeholder="Descripción"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Fecha:</label>
            <input
              type="date"
              value={modoEdicion ? eventoSeleccionado?.fecha : nuevoEvento.fecha}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, fecha: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })
              }
              required
            />
          </div>
          <div className="form-grupo">
            <label>Hora:</label>
            <input
              type="time"
              value={modoEdicion ? eventoSeleccionado?.hora : nuevoEvento.hora}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, hora: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, hora: e.target.value })
              }
              required
            />
          </div>
          <div className="form-grupo">
            <label>Lugar:</label>
            <input
              type="text"
              value={modoEdicion ? eventoSeleccionado?.lugar : nuevoEvento.lugar}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, lugar: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, lugar: e.target.value })
              }
              placeholder="Lugar"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Responsable:</label>
            <input
              type="text"
              value={modoEdicion ? eventoSeleccionado?.responsable : nuevoEvento.responsable}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, responsable: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, responsable: e.target.value })
              }
              placeholder="Responsable"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Evento"}
          </button>
        </div>
      </div>
    </div>
    );
};

export default EventoModal;