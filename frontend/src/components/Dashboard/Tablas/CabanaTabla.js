import React from   "react";


const CabanaTabla = ({cabanas, onEditar, onEliminar }) => (
    <div className="tabla-contenedor">
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Capacidad</th>
          <th>Categoría</th>
          <th>Estado</th>
          <th>Creado por</th>
          <th>imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cabanas.length === 0 ? (
          <tr>
            <td colSpan={7}>No hay cabañas para mostrar</td>
          </tr>
        ) : (
          cabanas.map((cabana) => (
            <tr key={cabana._id}>
              <td>{cabana._id}</td>
              <td>{cabana.nombre}</td>
              <td>{cabana.descripcion}</td>
              <td>{cabana.capacidad}</td>
              <td>{cabana.categoria?.nombre || cabana.categoria || "N/A"}</td>
              <td>{cabana.estado}</td>
              <td>{cabana.creadoPor}</td>
              <td>{cabana.imagen || "N/A" }</td>
              <td>
                <button className="btn-editar" onClick={() => onEditar(cabana)}>
                  ✏️
                </button>
                <button className="btn-eliminar" onClick={() => onEliminar(cabana._id)}>
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
export default CabanaTabla;