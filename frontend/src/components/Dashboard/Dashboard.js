import { useState, useEffect } from "react"
import { userService } from "../../services/userService";
import { eventService } from "../../services/eventService";
import "./Dashboard.css"

const Dashboard = ({ usuario, onCerrarSesion }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    administradores: 0,
    nuevosHoy: 0,
  });

  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    lasname: "",
    email: "",
    phone: "",
    password: "",
    role: "participante",
  });

  // Obtener usuarios
  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      const usuariosData = Array.isArray(data.data) ? data.data : [];
      setUsuarios(usuariosData);
      calcularEstadisticas(usuariosData);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
      if (error.message === "Unauthorized") {
        localStorage.removeItem("token");
        onCerrarSesion();
      }
    } finally {
      setCargando(false);
    }
  };

  // Calcular estadísticas
  const calcularEstadisticas = (usuariosData) => {
    const hoy = new Date().toDateString();
    setEstadisticas({
      totalUsuarios: usuariosData.length,
      usuariosActivos: usuariosData.filter((user) => user.status === "active").length,
      administradores: usuariosData.filter((user) => user.role === "admin").length,
      nuevosHoy: usuariosData.filter((user) => new Date(user.createdAt).toDateString() === hoy).length,
    });
  };

  // Crear usuario
  const crearUsuario = async () => {
    try {
      await userService.createUser(nuevoUsuario);
      alert("Usuario creado exitosamente");
      setMostrarModal(false);
      setNuevoUsuario({ username: "", lasname: "", email: "", phone: "", password: "", role: "participante" });
      obtenerUsuarios();
    } catch (error) {
      alert(`Error al crear el usuario: ${error.message}`);
    }
  };

  // Actualizar usuario
  const actualizarUsuario = async () => {
    try {
      await userService.updateUser(usuarioSeleccionado._id, {
        username: usuarioSeleccionado.username,
        lasname: usuarioSeleccionado.lasname,
        email: usuarioSeleccionado.email,
        phone: usuarioSeleccionado.phone,
        role: usuarioSeleccionado.role,
        status: usuarioSeleccionado.status,
      });
      alert("Usuario actualizado exitosamente");
      setMostrarModal(false);
      setUsuarioSeleccionado(null);
      setModoEdicion(false);
      obtenerUsuarios();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (userId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      return;
    }
    try {
      await userService.deleteUser(userId);
      alert("Usuario eliminado exitosamente");
      obtenerUsuarios();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Abrir modal para crear usuario
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevoUsuario({ username: "", lasname: "", email: "", phone: "", password: "", role: "participante" });
    setMostrarModal(true);
  };

  // Abrir modal para editar usuario
  const abrirModalEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioSeleccionado({ ...usuario });
    setMostrarModal(true);
  };

  useEffect(() => {
    obtenerUsuarios();
    // eslint-disable-next-line
  }, []);

  // Filtrar usuarios
  const usuariosFiltrados = Array.isArray(usuarios)
    ? usuarios.filter(
      (user) =>
        user.username?.toLowerCase().includes(busqueda.toLowerCase()) ||
        user.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
        user.role?.toLowerCase().includes(busqueda.toLowerCase())
    )
    : [];

  const obtenerEventos = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEventos(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert("Error al obtener eventos");
    }
  };

  // Función para obtener categorías
  const obtenerCategorias = async () => {
    try {
      const res = await fetch("/api/categorizacion", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (data.success) setCategorias(data.data);
    } catch (error) {
      alert("Error al obtener categorías");
    }
  };

  // Abrir modal para categorizar evento
  const abrirModalCategorizar = (evento) => {
    setEventoSeleccionado(evento);
    setCategoriaSeleccionada(evento.categoria?._id || "");
    setMostrarModalCategoria(true);
  };

  // Categorizar evento
  const categorizarEvento = async () => {
    if (!categoriaSeleccionada) {
      alert("Selecciona una categoría");
      return;
    }
    try {
      const res = await fetch(`/api/eventos/${eventoSeleccionado._id}/categorizar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ categoria: categoriaSeleccionada })
      });
      const data = await res.json();
      if (data.success) {
        alert("Evento categorizado correctamente");
        setMostrarModalCategoria(false);
        obtenerEventos();
      } else {
        alert(data.message || "Error al categorizar evento");
      }
    } catch (error) {
      alert("Error al categorizar evento");
    }
  };

  // Llama a obtenerEventos y obtenerCategorias cuando se activa la sección de eventos
  useEffect(() => {
    if (seccionActiva === "eventos") {
      obtenerEventos();
      obtenerCategorias();
    }
  }, [seccionActiva]);
  if (cargando) {
    return (
      <div className="cargando-contenedor">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-contenedor">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarAbierto ? "abierto" : "cerrado"}`}>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
        <div className="sidebar-header">
          <div className="logo">
            <span className="luckas">Luckas</span><span className="ent">ent</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-seccion">
            <div className="nav-titulo">PRINCIPAL</div>
            <ul>
              <li className={seccionActiva === "dashboard" ? "activo" : ""}>
                <a href="#" onClick={() => setSeccionActiva("dashboard")}>
                  <span className="nav-icon">📊</span>
                  <span className="nav-texto">Dashboard</span>
                </a>
              </li>
              <li className={seccionActiva === "usuarios" ? "activo" : ""}>
                <a href="#" onClick={() => setSeccionActiva("usuarios")}>
                  <span className="nav-icon">👥</span>
                  <span className="nav-texto">Usuarios</span>
                </a>
              </li>
              <li className={seccionActiva === "configuracion" ? "activo" : ""}>
                <a href="#" onClick={() => setSeccionActiva("configuracion")}>
                  <span className="nav-icon">⚙️</span>
                  <span className="nav-texto">Configuración</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="nav-seccion">
            <div className="nav-titulo">GESTIÓN</div>
            <ul>
              <li>
                <a href="#" onClick={() => setSeccionActiva("solicitudes")}>
                  <span className="nav-icon">📨</span>
                  <span className="nav-texto">Solicitudes</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("actividades")}>
                  <span className="nav-icon">📋</span>
                  <span className="nav-texto">Actividades</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("inscripciones")}>
                  <span className="nav-icon">📝</span>
                  <span className="nav-texto">Inscripciones</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("eventos")}>
                  <span className="nav-icon">📅</span>
                  <span className="nav-texto">Eventos</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("tareas")}>
                  <span className="nav-icon">✅</span>
                  <span className="nav-texto">Tareas</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("reportes")}>
                  <span className="nav-icon">📈</span>
                  <span className="nav-texto">Reportes</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <div className="contenido-principal">
        {/* Header */}
        <header className="header">
          <div className="header-izquierda">
            <button className="btn-menu" onClick={() => setSidebarAbierto(!sidebarAbierto)}>
              ☰
            </button>
            <div className="breadcrumb">
              <span>Inicio</span>
              <span>/</span>
              <span>{seccionActiva === "dashboard" ? "Dashboard" : "Usuarios"}</span>
            </div>
          </div>

          <div className="header-derecha">
            <div className="notificaciones">
              <span className="notif-icon">🔔</span>
              <span className="notif-badge">3</span>
            </div>
            <div className="usuario-info">
              <div className="usuario-avatar">{usuario?.username?.substring(0, 2).toUpperCase()}</div>
              <span className="usuario-nombre">{usuario?.username}</span>
              <button className="btn-logout" onClick={onCerrarSesion}>
                🚪
              </button>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="contenido">
          {seccionActiva === "dashboard" && (
            <>
              {/* Tarjetas de Estadísticas */}
              <div className="estadisticas-grid">
                <div className="tarjeta-stat morada">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.totalUsuarios}</div>
                    <div className="stat-label">Usuarios Totales</div>
                    <div className="stat-cambio">+12.4% ↑</div>
                  </div>
                  <div className="stat-grafico">📈</div>
                </div>

                <div className="tarjeta-stat azul">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.usuariosActivos}</div>
                    <div className="stat-label">Usuarios Activos</div>
                    <div className="stat-cambio">+40.9% ↑</div>
                  </div>
                  <div className="stat-grafico">👥</div>
                </div>

                <div className="tarjeta-stat naranja">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.administradores}</div>
                    <div className="stat-label">Administradores</div>
                    <div className="stat-cambio">+84.7% ↑</div>
                  </div>
                  <div className="stat-grafico">🛡️</div>
                </div>

                <div className="tarjeta-stat roja">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.nuevosHoy}</div>
                    <div className="stat-label">Nuevos Hoy</div>
                    <div className="stat-cambio">-23.6% ↓</div>
                  </div>
                  <div className="stat-grafico">📊</div>
                </div>
              </div>

              {/* Gráfico de Actividad */}
              <div className="tarjeta-grafico">
                <div className="grafico-header">
                  <h3>Actividad de Usuarios</h3>
                  <div className="grafico-controles">
                    <button className="btn-periodo activo">Día</button>
                    <button className="btn-periodo">Mes</button>
                    <button className="btn-periodo">Año</button>
                  </div>
                </div>
                <div className="grafico-placeholder">
                  <div className="grafico-linea"></div>
                  <p>Gráfico de actividad de usuarios en tiempo real</p>
                </div>
              </div>
            </>
          )}

          {seccionActiva === "usuarios" && (
            <>
              {/* Sección de Usuarios */}
              <div className="seccion-usuarios">
                <div className="seccion-header">
                  <h2>Gestión de Usuarios</h2>
                  <button className="btn-primary" onClick={abrirModalCrear}>
                    ➕ Nuevo Usuario
                  </button>
                </div>

                {/* Búsqueda */}
                <div className="busqueda-contenedor">
                  <input
                    type="text"
                    placeholder="🔍 Buscar usuarios..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="input-busqueda"
                  />
                </div>

                {/* Tabla de Usuarios */}
                <div className="tabla-contenedor">
                  <table className="tabla-usuarios">
                    <thead>
                      <tr >
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th>
                        <th>Telefono</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((user) => (
                        <tr key={user.id}>
                          <td>{user._id}</td>
                          <td>
                            <div className="usuario-celda">
                              <div className="usuario-avatar-mini">{user.username?.substring(0, 2).toUpperCase()}</div>
                              <span>{user.username}</span>
                            </div>
                          </td>
                          <td>{user.lasname}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>
                            <span className={`badge-rol rol-${user.role}`}>{user.role}</span>
                          </td>
                          <td>
                            <span className={`badge-estado estado-${user.status || "active"}`}>
                              {user.status || "activo"}
                            </span>
                          </td>
                          <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                          <td>
                            <div className="acciones-botones">
                              <button className="btn-editar" onClick={() => abrirModalEditar(user)}>
                                ✏️
                              </button>
                              <button className="btn-eliminar" onClick={() => eliminarUsuario(user._id)}>
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {seccionActiva === "configuracion" && (
            <div className="seccion-configuracion">
              <h2>Configuración del Sistema</h2>
              <p>Próximamente: Configuraciones del sistema</p>
            </div>
          )}
           {seccionActiva === "solicitudes" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Solicitudes</h2>
                <button className="btn-primary" onClick={abrirModalCrear}>
                    ➕ Nuevo Solicitud
                  </button>
              </div>
             
              <div className="tabla-contenedor">
                <table className="tabla-usuarios">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </table>
              </div>

            </div>
          )}
          {seccionActiva === "actividades" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Actividades</h2>
                <button className="btn-primary" onClick={abrirModalCrear}>
                    ➕ Nuevo Actividad
                  </button>
              </div>
             
              <div className="tabla-contenedor">
                <table className="tabla-usuarios">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </table>
              </div>

            </div>
          )}
          {seccionActiva === "inscripciones" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Inscripciones</h2>
                <button className="btn-primary" onClick={abrirModalCrear}>
                    ➕ Nuevo Inscripcion
                  </button>
              </div>
             
              <div className="tabla-contenedor">
                <table className="tabla-usuarios">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </table>
              </div>

            </div>
          )}
          {seccionActiva === "eventos" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Eventos</h2>
                <button className="btn-primary" onClick={abrirModalCrear}>
                    ➕ Nuevo Evento
                  </button>
              </div>
             
              <div className="tabla-contenedor">
                <table className="tabla-usuarios">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </table>
              </div>

            </div>
          )}
          {seccionActiva === "tareas" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Tareas</h2>
                <button className="btn-primary" onClick={abrirModalCrear}>
                    ➕ Nuevo Tarea
                  </button>
              </div>
             
              <div className="tabla-contenedor">
                <table className="tabla-usuarios">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>
              <button className="modal-cerrar" onClick={() => setMostrarModal(false)}>
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
                  <option value="participante">Participante</option>
                  <option value="seminarista">Seminarista</option>
                  <option value="logistico">Logístico</option>
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
              <button className="btn-secondary" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={modoEdicion ? actualizarUsuario : crearUsuario}>
                {modoEdicion ? "Guardar Cambios" : "Crear Usuario"}
              </button>
            </div>
          </div>
        </div>

      )}

      {mostrarModalCategoria && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Categorizar Evento</h3>
              <button className="modal-cerrar" onClick={() => setMostrarModalCategoria(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label>Selecciona una categoría:</label>
              <select
                value={categoriaSeleccionada}
                onChange={e => setCategoriaSeleccionada(e.target.value)}
              >
                <option value="">-- Selecciona --</option>
                {categorias.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setMostrarModalCategoria(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={categorizarEvento}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  )
}
export default Dashboard