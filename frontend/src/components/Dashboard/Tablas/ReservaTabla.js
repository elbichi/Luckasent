import React from "react";

const TablaReservas = ({ reservas, onEditar, onEliminar }) => (
  <div className="tabla-contenedor">
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Recurso</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Categoría</th>
          <th>Observaciones</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {reservas.length === 0 ? (
          <tr>
            <td colSpan={8}>No hay reservas para mostrar</td>
          </tr>
        ) : (
          reservas.map((reserva) => (
            <tr key={reserva._id}>
              <td>{reserva._id}</td>
              <td>{reserva.usuario?.username || reserva.usuario || "N/A"}</td>
              <td>{reserva.recurso?.nombre || reserva.recurso || "N/A"}</td>
              <td>{reserva.fechaInicio ? new Date(reserva.fechaInicio).toLocaleDateString() : ""}</td>
              <td>{reserva.fechaFin ? new Date(reserva.fechaFin).toLocaleDateString() : ""}</td>
              <td>{reserva.categoria?.nombre || reserva.categoria || "N/A"}</td>
              <td>{reserva.observaciones}</td>
              <td>
                <button className="btn-editar" onClick={() => onEditar(reserva)}>
                  ✏️
                </button>
                <button className="btn-eliminar" onClick={() => onEliminar(reserva._id)}>
                  🗑️
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default TablaReservas;