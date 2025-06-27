import React from "react";

const TablaInscripciones = ({ inscripciones, onEditar, onEliminar }) => (
  <div className="tabla-contenedor">
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID Inscripción</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Evento</th>
          <th>Categoría</th>
          <th>Estado</th>
          <th>Observaciones</th>
          <th>Fecha Inscripción</th>
          <th>Solicitud</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {inscripciones.length === 0 ? (
          <tr>
            <td colSpan={10}>No hay inscripciones para mostrar</td>
          </tr>
        ) : (
          inscripciones.map((ins) => (
            <tr key={ins._id}>
              <td>{ins._id}</td>
              <td>{ins.usuario?.username || "N/A"}</td>
              <td>{ins.usuario?.email || "N/A"}</td>
              <td>{ins.evento?.nombre || "N/A"}</td>
              <td>{ins.categoria?.nombre || "N/A"}</td>
              <td>{ins.estado || "N/A"}</td>
              <td>{ins.observaciones || ""}</td>
              <td>{ins.createdAt ? new Date(ins.createdAt).toLocaleDateString() : ""}</td>
              <td>{ins.solicitud?._id || ins.solicitud || ""}</td>
              <td>
                <button className="btn-editar" onClick={() => onEditar(ins)}>✏️</button>
                <button className="btn-eliminar" onClick={() => onEliminar(ins._id)}>🗑️</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default TablaInscripciones;