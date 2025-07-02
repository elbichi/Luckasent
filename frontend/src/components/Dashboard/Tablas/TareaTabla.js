import React from "react";

const TablaTareas = ({ tareas, onEditar, onEliminar, onCambiarEstado }) => {
  // Manejar el caso donde tareas es undefined, null o no es un array
  const listaTareas = Array.isArray(tareas) ? tareas : [];

  return (
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
            <th>Asignado a Rol</th>
            <th>Asignado Por</th>
            <th>Asignado por Rol</th>
            <th>Fecha Límite</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaTareas.length === 0 ? (
          <tr>
            <td colSpan={12}>No hay tareas para mostrar</td>
          </tr>
        ) : (
          listaTareas.map((tarea) => (
            <tr key={tarea._id}>
              <td>{tarea._id}</td>
              <td>{tarea.titulo}</td>
              <td>{tarea.descripcion?.substring(0, 100)}...</td>
              <td>{tarea.estado}</td>
              <td>
                <span className={`badge-prioridad prioridad-${tarea.prioridad}`}>
                  {tarea.prioridad?.charAt(0).toUpperCase() + tarea.prioridad?.slice(1)}
                </span>
              </td>
              <td>{tarea.asignadoA?.nombre || "N/A"}</td>
              <td>{tarea.asignadoA?.role || "N/A"}</td>
              <td>{tarea.asignadoPor?.nombre || "N/A"}</td>
              <td>{tarea.asignadoPor?.role || "N/A"}</td>
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
                  {onEliminar && (
                    <button className="btn-eliminar" onClick={() => onEliminar(tarea._id)}>
                      🗑️
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  );
};

export default TablaTareas;