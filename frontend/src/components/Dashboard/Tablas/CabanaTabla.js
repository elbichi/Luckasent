import React from "react";

const CabanaTabla = ({ cabanas, onEditar, onEliminar }) => {
  // Manejar el caso donde cabanas es undefined, null o no es un array
  const listaCabanas = Array.isArray(cabanas) ? cabanas : [];

  return (
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
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaCabanas.length === 0 ? (
          <tr>
            <td colSpan={9}>No hay cabañas para mostrar</td>
          </tr>
        ) : (
          listaCabanas.map((cabana) => (
            <tr key={cabana._id}>
              <td>{cabana._id}</td>
              <td>{cabana.nombre}</td>
              <td>{cabana.descripcion}</td>
              <td>{cabana.capacidad}</td>
              <td>{cabana.categoria?.nombre || cabana.categoria || "N/A"}</td>
              <td>{cabana.estado}</td>
              <td>{cabana.creadoPor}</td>
              <td>{cabana.imagen || "N/A"}</td>
              <td>
                <button className="btn-editar" onClick={() => onEditar(cabana)}>
                  ✏️
                </button>
                {onEliminar && (
                  <button className="btn-eliminar" onClick={() => onEliminar(cabana._id)}>
                    🗑️
                  </button>
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
export default CabanaTabla;