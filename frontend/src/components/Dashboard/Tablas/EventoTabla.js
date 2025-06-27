import React from "react";

const TablaEventos = ({ eventos, onEditar, onEliminar, onDeshabilitar }) => (
  <div className="tabla-contenedor">
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Categoría</th>
          <th>SubCategoría</th>
          <th>Prioridad</th>
          <th>Estado</th>
          <th>Etiquetas</th>
          <th>Fecha Creación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {eventos.length === 0 ? (
          <tr>
            <td colSpan={11}>No hay eventos para mostrar</td>
          </tr>
        ) : (
          eventos.map((evento) => (
            <tr key={evento._id}>
              <td>{evento._id}</td>
              <td>{evento.name}</td>
              <td>{evento.description?.substring(0, 50)}...</td>
              <td>${evento.price?.toLocaleString()}</td>
              <td>{evento.categoria?.nombre || "Sin categoría"}</td>
              <td>{evento.subCategoria || "N/A"}</td>
              <td>
                <span className={`badge-prioridad prioridad-${evento.prioridad?.toLowerCase()}`}>
                  {evento.prioridad}
                </span>
              </td>
              <td>
                <span className={`badge-estado estado-${evento.active ? "activo" : "inactivo"}`}>
                  {evento.active ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                {evento.etiquetas?.slice(0, 2).join(", ")}
                {evento.etiquetas?.length > 2 && " ..."}
              </td>
              <td>{evento.createdAt ? new Date(evento.createdAt).toLocaleDateString() : "N/A"}</td>
              <td>
                <div className="acciones-botones">
                  <button className="btn-editar" onClick={() => onEditar(evento)}>
                    ✏️
                  </button>
                  <button className="btn-warning" onClick={() => onDeshabilitar(evento._id)}>
                    ⏸️
                  </button>
                  <button className="btn-eliminar" onClick={() => onEliminar(evento._id)}>
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

export default TablaEventos;