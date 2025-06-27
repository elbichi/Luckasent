import React from "react";

const TablaUnificadaSolicitudes = ({
  datosUnificados = { solicitudes: [], inscripciones: [], reservas: [] },
  abrirModalEditarSolicitud,
  eliminarSolicitud,
  abrirModalEditarInscripcion,
  eliminarInscripcion,
  abrirModalEditarReserva,
  eliminarReserva,
}) => (
  <div className="tabla-contenedor">
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>ID</th>
          <th>Usuario/Solicitante</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Evento/Recurso</th>
          <th>Categoría</th>
          <th>Descripción/Observaciones</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {/* Solicitudes */}
        {(datosUnificados.solicitudes || []).map((sol) => (
          <tr key={`solicitud-${sol._id}`}>
            <td>Solicitud</td>
            <td>{sol._id}</td>
            <td>{sol.solicitante?.username || sol.solicitante || "N/A"}</td>
            <td>{sol.solicitante?.email || sol.email || "N/A"}</td>
            <td>{sol.telefono || "N/A"}</td>
            <td>{sol.tipoSolicitud || "N/A"}</td>
            <td>{sol.categoria?.nombre || sol.categoria || "N/A"}</td>
            <td>{sol.descripcion || sol.observaciones || ""}</td>
            <td>{sol.estado || "N/A"}</td>
            <td>{sol.fechaSolicitud ? new Date(sol.fechaSolicitud).toLocaleDateString() : ""}</td>
            <td>
              <button className="btn-editar" onClick={() => abrirModalEditarSolicitud(sol)}>✏️</button>
              <button className="btn-eliminar" onClick={() => eliminarSolicitud(sol._id)}>🗑️</button>
            </td>
          </tr>
        ))}
        {/* Inscripciones */}
        {(datosUnificados.inscripciones || []).map((ins) => (
          <tr key={`inscripcion-${ins._id}`}>
            <td>Inscripción</td>
            <td>{ins._id}</td>
            <td>{ins.usuario?.username || "N/A"}</td>
            <td>{ins.usuario?.email || "N/A"}</td>
            <td></td>
            <td>{ins.evento?.nombre || "N/A"}</td>
            <td>{ins.categoria?.nombre || "N/A"}</td>
            <td>{ins.observaciones || ""}</td>
            <td>{ins.estado || "N/A"}</td>
            <td>{ins.createdAt ? new Date(ins.createdAt).toLocaleDateString() : ""}</td>
            <td>
              <button className="btn-editar" onClick={() => abrirModalEditarInscripcion(ins)}>✏️</button>
              <button className="btn-eliminar" onClick={() => eliminarInscripcion(ins._id)}>🗑️</button>
            </td>
          </tr>
        ))}
        {/* Reservas */}
        {(datosUnificados.reservas || []).map((reserva) => (
          <tr key={`reserva-${reserva._id}`}>
            <td>Reserva</td>
            <td>{reserva._id}</td>
            <td>{reserva.usuario?.username || reserva.usuario || "N/A"}</td>
            <td></td>
            <td></td>
            <td>{reserva.recurso?.nombre || reserva.recurso || "N/A"}</td>
            <td>{reserva.categoria?.nombre || reserva.categoria || "N/A"}</td>
            <td>{reserva.observaciones}</td>
            <td></td>
            <td>{reserva.fechaInicio ? new Date(reserva.fechaInicio).toLocaleDateString() : ""}</td>
            <td>
              <button className="btn-editar" onClick={() => abrirModalEditarReserva(reserva)}>✏️</button>
              <button className="btn-eliminar" onClick={() => eliminarReserva(reserva._id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default TablaUnificadaSolicitudes;