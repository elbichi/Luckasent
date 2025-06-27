import React from "react";

const InscripcionModal = ({
  mostrar,
  modoEdicion,
  inscripcionSeleccionada,
  setInscripcionSeleccionada,
  nuevaInscripcion,
  setNuevaInscripcion,
  usuarios,
  eventos,
  categorias,
  onClose,
  onSubmit
}) => {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Inscripción" : "Nueva Inscripción"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {/* Usuario */}
          <div className="form-grupo">
            <label>Usuario:</label>
            <select
              value={modoEdicion ? inscripcionSeleccionada?.usuario : nuevaInscripcion.usuario}
              onChange={e =>
                modoEdicion
                  ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, usuario: e.target.value })
                  : setNuevaInscripcion({ ...nuevaInscripcion, usuario: e.target.value })
              }
              required
            >
              <option value="">Seleccione...</option>
              {usuarios && usuarios.map(user => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>
          {/* Evento */}
          <div className="form-grupo">
            <label>Evento:</label>
            <select
              value={modoEdicion ? inscripcionSeleccionada?.evento : nuevaInscripcion.evento}
              onChange={e =>
                modoEdicion
                  ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, evento: e.target.value })
                  : setNuevaInscripcion({ ...nuevaInscripcion, evento: e.target.value })
              }
              required
            >
              <option value="">Seleccione...</option>
              {eventos && eventos.map(ev => (
                <option key={ev._id} value={ev._id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
          {/* Categoría */}
          <div className="form-grupo">
            <label>Categoría:</label>
            <select
              value={modoEdicion ? inscripcionSeleccionada?.categoria : nuevaInscripcion.categoria}
              onChange={e =>
                modoEdicion
                  ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, categoria: e.target.value })
                  : setNuevaInscripcion({ ...nuevaInscripcion, categoria: e.target.value })
              }
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
          {/* Estado */}
          <div className="form-grupo">
            <label>Estado:</label>
            <select
              value={modoEdicion ? inscripcionSeleccionada?.estado : nuevaInscripcion.estado}
              onChange={e =>
                modoEdicion
                  ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, estado: e.target.value })
                  : setNuevaInscripcion({ ...nuevaInscripcion, estado: e.target.value })
              }
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          {/* Observaciones */}
          <div className="form-grupo">
            <label>Observaciones:</label>
            <input
              type="text"
              value={modoEdicion ? inscripcionSeleccionada?.observaciones : nuevaInscripcion.observaciones}
              onChange={e =>
                modoEdicion
                  ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, observaciones: e.target.value })
                  : setNuevaInscripcion({ ...nuevaInscripcion, observaciones: e.target.value })
              }
              placeholder="Observaciones"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Inscripción"}
          </button>
        </div>
      </div>
    </div>
  );

};

export default InscripcionModal;