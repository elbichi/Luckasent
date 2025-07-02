import React from "react";

const TablaCategorias = ({ categorias, onEditar, onEliminar }) => {
  // Manejar el caso donde categorias es undefined, null o no es un array
  const listaCategorias = Array.isArray(categorias) ? categorias : [];

  return (
    <div className="tabla-contenedor">
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaCategorias.length === 0 ? (
          <tr>
            <td colSpan={5}>No hay categorías para mostrar</td>
          </tr>
        ) : (
          listaCategorias.map((cat) => (
            <tr key={cat._id}>
              <td>{cat._id}</td>
              <td>{cat.nombre}</td>
              <td>{cat.descripcion}</td>
              <td>
                <span className={`badge-estado estado-${cat.estado || "activo"}`}>
                  {cat.estado || "activo"}
                </span>
              </td>
              <td>
                <div className="acciones-botones">
                  <button className="btn-editar" onClick={() => onEditar(cat)}>✏️</button>
                  {onEliminar && (
                    <button className="btn-eliminar" onClick={() => onEliminar(cat._id)}>🗑️</button>
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

export default TablaCategorias;