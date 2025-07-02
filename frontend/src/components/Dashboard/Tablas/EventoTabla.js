import React from "react";

const TablaEventos = ({ eventos, onEditar, onEliminar, onDeshabilitar }) => {
  // Manejar el caso donde eventos es undefined, null o no es un array
  const listaEventos = Array.isArray(eventos) ? eventos : [];

  return (
    <div className="tabla-contenedor">
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Fecha Evento</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Lugar</th>
            <th>Cupos Totales</th>
            <th>Cupos Disponibles</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaEventos.length === 0 ? (
            <tr>
              <td colSpan={15}>No hay eventos para mostrar</td>
            </tr>
          ) : (
            listaEventos.map((evento) => (
              <tr key={evento._id}>
                <td>{evento._id}</td>
                <td>{evento.nombre}</td>
                <td>${evento.precio?.toLocaleString()}</td>
                <td>{evento.categoria?.nombre || "Sin categoría"}</td>
                <td>{evento.fechaEvento ? new Date(evento.fechaEvento).toLocaleDateString() : "N/A"}</td>
                <td>{evento.horaInicio}</td>
                <td>{evento.horaFin}</td>
                <td>{evento.lugar}</td>
                <td>{evento.cuposTotales}</td>
                <td>{evento.cuposDisponibles}</td>
                <td>{evento.prioridad}</td>
                <td>
                  <span className={`badge-estado estado-${evento.active ? "activo" : "inactivo"}`}>
                    {evento.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>{evento.createdAt ? new Date(evento.createdAt).toLocaleDateString() : "N/A"}</td>
                <td>
                  {evento.imagen ? (
                    <img src={evento.imagen} alt={evento.nombre} className="imagen-evento" />
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td>
                  <div className="acciones-botones">
                    <button className="btn-editar" onClick={() => onEditar(evento)}>✏️</button>
                    <button className="btn-warning" onClick={() => onDeshabilitar(evento._id)}>⏸️</button>
                    {onEliminar && (
                      <button className="btn-eliminar" onClick={() => onEliminar(evento._id)}>🗑️</button>
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

export default TablaEventos;