import React from "react";

const TareaModal = ({
  mostrar,
  modoEdicion,
  tareaSeleccionada,
  setTareaSeleccionada,
  nuevaTarea,
  setNuevaTarea,
  onClose,
  onSubmit
}) => {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Tarea" : "Crear Nueva Tarea"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grupo">
            <label>Título:</label>
            <input
              type="text"
              value={modoEdicion ? tareaSeleccionada?.titulo : nuevaTarea.titulo}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, titulo: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })
              }
              placeholder="Título de la tarea"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Descripción:</label>
            <input
              type="text"
              value={modoEdicion ? tareaSeleccionada?.descripcion : nuevaTarea.descripcion}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, descripcion: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })
              }
              placeholder="Descripción"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Fecha Límite:</label>
            <input
              type="date"
              value={modoEdicion ? tareaSeleccionada?.fechaLimite : nuevaTarea.fechaLimite}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, fechaLimite: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, fechaLimite: e.target.value })
              }
              required
            />
          </div>
          <div className="form-grupo">
            <label>Responsable:</label>
            <input
              type="text"
              value={modoEdicion ? tareaSeleccionada?.responsable : nuevaTarea.responsable}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, responsable: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, responsable: e.target.value })
              }
              placeholder="Responsable"
            />
          </div>
          <div className="form-grupo">
            <label>Estado:</label>
            <select
              value={modoEdicion ? tareaSeleccionada?.estado : nuevaTarea.estado}
              onChange={e =>
                modoEdicion
                  ? setTareaSeleccionada({ ...tareaSeleccionada, estado: e.target.value })
                  : setNuevaTarea({ ...nuevaTarea, estado: e.target.value })
              }
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Tarea"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TareaModal;