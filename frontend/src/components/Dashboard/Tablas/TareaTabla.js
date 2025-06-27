import React from "react";

const TablaTareas = ({ tareas = [], onEditar, onEliminar, onCambiarEstado }) => (
  <div className="tabla-contenedor">
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Prioridad</th>
          <th>Asignado A</th>
          <th>Asignado Por</th>
          <th>Fecha Límite</th>
          <th>Fecha Creación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {tareas.length === 0 ? (
          <tr>
            <td colSpan={10}>No hay tareas para mostrar</td>
          </tr>
        ) : (
          tareas.map((tarea) => (
            <tr key={tarea._id}>
              <td>{tarea._id}</td>
              <td>{tarea.titulo}</td>
              <td>{tarea.descripcion?.substring(0, 50)}...</td>
              <td>
                <select
                  value={tarea.estado}
                  onChange={(e) => onCambiarEstado(tarea._id, e.target.value)}
                  className={`badge-estado estado-${tarea.estado?.replace(' ', '-')}`}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </td>
              <td>
                <span className={`badge-prioridad prioridad-${tarea.prioridad}`}>
                  {tarea.prioridad?.charAt(0).toUpperCase() + tarea.prioridad?.slice(1)}
                </span>
              </td>
              <td>{tarea.asignadoA?.username || "N/A"}</td>
              <td>{tarea.asignadoPor?.username || "N/A"}</td>
              <td>
                {tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : "N/A"}
              </td>
              <td>
                {tarea.createdAt ? new Date(tarea.createdAt).toLocaleDateString() : "N/A"}
              </td>
              <td>
                <div className="acciones-botones">
                  <button className="btn-editar" onClick={() => onEditar(tarea)}>
                    ✏️
                  </button>
                  <button className="btn-eliminar" onClick={() => onEliminar(tarea._id)}>
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default TablaTareas;