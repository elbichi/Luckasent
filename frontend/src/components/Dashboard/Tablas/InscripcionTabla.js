import React from "react";

const TablaInscripciones = ({ inscripciones, onEditar, onEliminar }) => {
  // Manejar el caso donde inscripciones es undefined, null o no es un array
  const listaInscripciones = Array.isArray(inscripciones) ? inscripciones : [];

  return (
    <div className="tabla-contenedor">
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID Inscripción</th>
            <th>Nombre completo</th>
            <th>Tipo de Documento</th>
            <th>Número de Documento</th>
            <th>Teléfono</th>
            <th>Edad</th>
            <th>Categoría</th>
            <th>Evento</th>
            <th>Observaciones</th>
            <th>Fecha de inscripción</th>
            <th>Estado de la inscripción</th>
            <th>Solicitud</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaInscripciones.length === 0 ? (
          <tr>
            <td colSpan={13}>No hay inscripciones para mostrar</td>
          </tr>
        ) : (
          listaInscripciones.map((ins) => (
            <tr key={ins._id}>
              <td>{ins._id}</td>
              <td>{(ins.nombre && ins.apellido) ? `${ins.nombre} ${ins.apellido}` : ins.nombre || ins.apellido || "N/A"}</td>
              <td>{ins.tipoDocumento || "N/A"}</td>
              <td>{ins.numeroDocumento || "N/A"}</td>
              <td>{ins.telefono || "N/A"}</td>
              <td>{ins.edad || "N/A"}</td>
              <td>{ins.categoria?.nombre || "N/A"}</td>
              <td>{ins.evento?.nombre || "N/A"}</td>
              <td>{ins.observaciones || "N/A"}</td>
              <td>{ins.fechaInscripcion || "N/A"}</td>
              <td>{ins.estado || "N/A"}</td>
              <td>{ins.solicitud?._id || ins.solicitud || ""}</td>
              <td>
                <button className="btn-editar" onClick={() => onEditar(ins)}>✏️</button>
                {onEliminar && (
                  <button className="btn-eliminar" onClick={() => onEliminar(ins._id)}>🗑️</button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  );
};

export default TablaInscripciones;