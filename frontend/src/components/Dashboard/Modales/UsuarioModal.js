import React from "react";

const UsuarioModal = ({
  mostrar,
  modoEdicion,
  usuarioSeleccionado,
  setUsuarioSeleccionado,
  nuevoUsuario,
  setNuevoUsuario,
  onClose,
  onSubmit
}) => {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grupo">
            <label>Nombre:</label>
            <input
              type="text"
              value={modoEdicion ? usuarioSeleccionado?.username : nuevoUsuario.username}
              onChange={e =>
                modoEdicion
                  ? setUsuarioSeleccionado({ ...usuarioSeleccionado, username: e.target.value })
                  : setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })
              }
              placeholder="Nombre"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Apellido:</label>
            <input
              type="text"
              value={modoEdicion ? usuarioSeleccionado?.lasname : nuevoUsuario.lasname}
              onChange={e =>
                modoEdicion
                  ? setUsuarioSeleccionado({ ...usuarioSeleccionado, lasname: e.target.value })
                  : setNuevoUsuario({ ...nuevoUsuario, lasname: e.target.value })
              }
              placeholder="Apellido"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Teléfono:</label>
            <input
              type="text"
              value={modoEdicion ? usuarioSeleccionado?.phone : nuevoUsuario.phone}
              onChange={e =>
                modoEdicion
                  ? setUsuarioSeleccionado({ ...usuarioSeleccionado, phone: e.target.value })
                  : setNuevoUsuario({ ...nuevoUsuario, phone: e.target.value })
              }
              placeholder="Teléfono"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Email:</label>
            <input
              type="email"
              value={modoEdicion ? usuarioSeleccionado?.email : nuevoUsuario.email}
              onChange={e =>
                modoEdicion
                  ? setUsuarioSeleccionado({ ...usuarioSeleccionado, email: e.target.value })
                  : setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
              }
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Contraseña:</label>
            <input
              type="password"
              value={modoEdicion ? usuarioSeleccionado?.password : nuevoUsuario.password}
              onChange={e =>
                modoEdicion
                  ? setUsuarioSeleccionado({ ...usuarioSeleccionado, password: e.target.value })
                  : setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
              }
              placeholder="Contraseña"
              required
            />
          </div>
          <div className="form-grupo">
            <label>Rol:</label>
            <select
              value={modoEdicion ? usuarioSeleccionado?.role : nuevoUsuario.role}
              onChange={e =>
                modoEdicion
                  ? setUsuarioSeleccionado({ ...usuarioSeleccionado, role: e.target.value })
                  : setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })
              }
              required
            >
              <option value="admin">Admin</option>
              <option value="tesorero">Tesorero</option>
              <option value="seminarista">Seminarista</option>
              <option value="externo">Externo</option>
            </select>
          </div>
          {modoEdicion && (
            <div className="form-grupo">
              <label>Estado:</label>
              <select
                value={usuarioSeleccionado?.status || "active"}
                onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, status: e.target.value })}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="suspended">Suspendido</option>
              </select>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Usuario"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioModal;