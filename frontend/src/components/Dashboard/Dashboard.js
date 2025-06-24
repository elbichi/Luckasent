import { useState, useEffect } from "react"
import { userService } from "../../services/userService";
import { inscripcionService } from "../../services/inscripcionService";
import { solicitudService } from "../../services/solicirudService";
import { eventService } from "../../services/eventService";
import { tareaService } from "../../services/tareaService";
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
  //---------------------------------------------------------------------------------------------------------------
  const [solicitudes, setSolicitudes] = useState([]);
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    solicitante: "",
    email: "",
    telefono: "",
    tipoSolicitud: "",
    categoria: "",
    descripcion: "",
    prioridad: "Media",
    responsable: "",
    observaciones: ""
  });
  const [modoEdicionSolicitud, setModoEdicionSolicitud] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  /*------------------------------------------------------------------------------------------------*/

  const [inscripciones, setInscripciones] = useState([]);
  const [nuevaInscripcion, setNuevaInscripcion] = useState({
    usuario: "",
    evento: "",
    categoria: "",
    observaciones: ""
  });
  const [modoEdicionInscripcion, setModoEdicionInscripcion] = useState(false);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  //----------------------------------------------------------------------------------------------------------
  // Estados para eventos
  const [eventos, setEventos] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    name: "",
    description: "",
    price: 0,
    categoria: "",
    subCategoria: "",
    etiquetas: [],
    images: "",
    prioridad: "Normal",
    observaciones: "",
    active: true
  });
  const [modoEdicionEvento, setModoEdicionEvento] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [categorias, setCategorias] = useState([]);
  //----------------------------------------------------------------------------------------------------------
  // Estados para tareas
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    descripcion: "",
    estado: "pendiente",
    prioridad: "media",
    asignadoA: "",
    asignadoPor: "",
    fechaLimite: "",
    comentarios: []
  });
  const [modoEdicionTarea, setModoEdicionTarea] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  //----------------------------------------------------------------------------------------------------------
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
  //para cerrar la sesion 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
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
  /*-----------------------------------------------------------------------------------------------------------*/
  // Obtener solicitudes
  const obtenerSolicitudes = async () => {
    try {
      const data = await solicitudService.getAll();
      console.log("Respuesta solicitudes:", data);
      setSolicitudes(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert("Error al obtener solicitudes");
    }
  };

  // Crear solicitud
  const crearSolicitud = async () => {
    try {
      await solicitudService.create(nuevaSolicitud);
      alert("Solicitud creada exitosamente");
      setMostrarModal(false);
      setNuevaSolicitud({
        solicitante: "",
        email: "",
        telefono: "",
        tipoSolicitud: "",
        categoria: "",
        descripcion: "",
        prioridad: "Media",
        responsable: "",
        observaciones: ""
      });
      obtenerSolicitudes();
    } catch (error) {
      alert(`Error al crear la solicitud: ${error.message}`);
    }
  };

  // Actualizar solicitud
  const actualizarSolicitud = async () => {
    try {
      await solicitudService.update(solicitudSeleccionada._id, solicitudSeleccionada);
      alert("Solicitud actualizada exitosamente");
      setMostrarModal(false);
      setSolicitudSeleccionada(null);
      setModoEdicionSolicitud(false);
      obtenerSolicitudes();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Eliminar solicitud
  const eliminarSolicitud = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta solicitud?")) return;
    try {
      await solicitudService.delete(id);
      alert("Solicitud eliminada exitosamente");
      obtenerSolicitudes();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Abrir modal para crear solicitud
  const abrirModalCrearSolicitud = () => {
    setModoEdicionSolicitud(false);
    setNuevaSolicitud({
      solicitante: "",
      email: "",
      telefono: "",
      tipoSolicitud: "",
      categoria: "",
      descripcion: "",
      prioridad: "Media",
      responsable: "",
      observaciones: ""
    });
    setMostrarModal(true);
  };

  // Abrir modal para editar solicitud
  const abrirModalEditarSolicitud = (solicitud) => {
    setModoEdicionSolicitud(true);
    setSolicitudSeleccionada({ ...solicitud });
    setMostrarModal(true);
  };

  // Llama a obtenerSolicitudes cuando se activa la sección de solicitudes
  useEffect(() => {
    if (seccionActiva === "solicitudes") {
      obtenerSolicitudes();
    }
  }, [seccionActiva]);


  //-----------------------------------------------------------------------------------------------------------

  // Obtener inscripciones
  const obtenerInscripciones = async () => {
    try {
      const data = await inscripcionService.getAll();
      setInscripciones(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert("Error al obtener inscripciones");
    }
  };

  // Crear inscripción
  const crearInscripcion = async () => {
    try {
      await inscripcionService.create(nuevaInscripcion);
      alert("Inscripción creada exitosamente");
      setMostrarModal(false);
      setNuevaInscripcion({ usuario: "", evento: "", categoria: "", observaciones: "" });
      obtenerInscripciones();
    } catch (error) {
      alert(`Error al crear la inscripción: ${error.message}`);
    }
  };

  // Actualizar inscripción
  const actualizarInscripcion = async () => {
    try {
      await inscripcionService.update(inscripcionSeleccionada._id, inscripcionSeleccionada);
      alert("Inscripción actualizada exitosamente");
      setMostrarModal(false);
      setInscripcionSeleccionada(null);
      setModoEdicionInscripcion(false);
      obtenerInscripciones();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Eliminar inscripción
  const eliminarInscripcion = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta inscripción?")) return;
    try {
      await inscripcionService.delete(id);
      alert("Inscripción eliminada exitosamente");
      obtenerInscripciones();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Abrir modal para crear inscripción
  const abrirModalCrearInscripcion = () => {
    setModoEdicionInscripcion(false);
    setNuevaInscripcion({ usuario: "", evento: "", categoria: "", observaciones: "" });
    setMostrarModal(true);
  };

  // Abrir modal para editar inscripción
  const abrirModalEditarInscripcion = (inscripcion) => {
    setModoEdicionInscripcion(true);
    setInscripcionSeleccionada({ ...inscripcion });
    setMostrarModal(true);
  };

  useEffect(() => {
    if (seccionActiva === "inscripciones") {
      obtenerInscripciones();
    }
  }, [seccionActiva]);

  //-----------------------------------------------------------------------------------------------------------
  // FUNCIONES PARA GESTIÓN DE EVENTOS

  // Obtener todos los eventos
  const obtenerEventos = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEventos(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert("Error al obtener eventos: " + error.message);
    }
  };

  // Crear evento
  const crearEvento = async () => {
    try {
      await eventService.createEvent(nuevoEvento);
      alert("Evento creado exitosamente");
      setMostrarModal(false);
      setNuevoEvento({
        name: "",
        description: "",
        price: 0,
        categoria: "",
        subCategoria: "",
        etiquetas: [],
        images: "",
        prioridad: "Normal",
        observaciones: "",
        active: true
      });
      obtenerEventos();
    } catch (error) {
      alert(`Error al crear el evento: ${error.message}`);
    }
  };

  // Actualizar evento
  const actualizarEvento = async () => {
    try {
      await eventService.updateEvent(eventoSeleccionado._id, eventoSeleccionado);
      alert("Evento actualizado exitosamente");
      setMostrarModal(false);
      setEventoSeleccionado(null);
      setModoEdicionEvento(false);
      obtenerEventos();
    } catch (error) {
      alert(`Error al actualizar evento: ${error.message}`);
    }
  };

  // Eliminar evento
  const eliminarEvento = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este evento?")) return;
    try {
      await eventService.deleteEvent(id);
      alert("Evento eliminado exitosamente");
      obtenerEventos();
    } catch (error) {
      alert(`Error al eliminar evento: ${error.message}`);
    }
  };

  // Deshabilitar evento
  const deshabilitarEvento = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres deshabilitar este evento?")) return;
    try {
      await eventService.disableEvent(id);
      alert("Evento deshabilitado exitosamente");
      obtenerEventos();
    } catch (error) {
      alert(`Error al deshabilitar evento: ${error.message}`);
    }
  };

  // Abrir modal para crear evento
  const abrirModalCrearEvento = () => {
    setModoEdicionEvento(false);
    setNuevoEvento({
      name: "",
      description: "",
      price: 0,
      categoria: "",
      subCategoria: "",
      etiquetas: [],
      images: "",
      prioridad: "Normal",
      observaciones: "",
      active: true
    });
    setMostrarModal(true);
  };

  // Abrir modal para editar evento
  const abrirModalEditarEvento = (evento) => {
    setModoEdicionEvento(true);
    setEventoSeleccionado({ 
      ...evento,
      etiquetas: Array.isArray(evento.etiquetas) ? evento.etiquetas : []
    });
    setMostrarModal(true);
  };

  // Cargar eventos cuando se activa la sección
  useEffect(() => {
    if (seccionActiva === "eventos") {
      obtenerEventos();
    }
  }, [seccionActiva]);

  //-----------------------------------------------------------------------------------------------------------
  // FUNCIONES PARA GESTIÓN DE TAREAS

  // Obtener todas las tareas
  const obtenerTareas = async () => {
    try {
      const data = await tareaService.getAll();
      setTareas(Array.isArray(data) ? data : []);
    } catch (error) {
      alert("Error al obtener tareas: " + error.message);
    }
  };

  // Crear tarea
  const crearTarea = async () => {
    try {
      await tareaService.create(nuevaTarea);
      alert("Tarea creada exitosamente");
      setMostrarModal(false);
      setNuevaTarea({
        titulo: "",
        descripcion: "",
        estado: "pendiente",
        prioridad: "media",
        asignadoA: "",
        asignadoPor: "",
        fechaLimite: "",
        comentarios: []
      });
      obtenerTareas();
    } catch (error) {
      alert(`Error al crear la tarea: ${error.message}`);
    }
  };

  // Actualizar tarea
  const actualizarTarea = async () => {
    try {
      await tareaService.update(tareaSeleccionada._id, tareaSeleccionada);
      alert("Tarea actualizada exitosamente");
      setMostrarModal(false);
      setTareaSeleccionada(null);
      setModoEdicionTarea(false);
      obtenerTareas();
    } catch (error) {
      alert(`Error al actualizar tarea: ${error.message}`);
    }
  };

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;
    try {
      await tareaService.delete(id);
      alert("Tarea eliminada exitosamente");
      obtenerTareas();
    } catch (error) {
      alert(`Error al eliminar tarea: ${error.message}`);
    }
  };

  // Cambiar estado de tarea
  const cambiarEstadoTarea = async (id, nuevoEstado) => {
    try {
      await tareaService.cambiarEstado(id, nuevoEstado);
      alert(`Estado de tarea cambiado a: ${nuevoEstado}`);
      obtenerTareas();
    } catch (error) {
      alert(`Error al cambiar estado: ${error.message}`);
    }
  };

  // Abrir modal para crear tarea
  const abrirModalCrearTarea = () => {
    setModoEdicionTarea(false);
    setNuevaTarea({
      titulo: "",
      descripcion: "",
      estado: "pendiente",
      prioridad: "media",
      asignadoA: "",
      asignadoPor: "",
      fechaLimite: "",
      comentarios: []
    });
    setMostrarModal(true);
  };

  // Abrir modal para editar tarea
  const abrirModalEditarTarea = (tarea) => {
    setModoEdicionTarea(true);
    setTareaSeleccionada({ 
      ...tarea,
      fechaLimite: tarea.fechaLimite ? new Date(tarea.fechaLimite).toISOString().split('T')[0] : ""
    });
    setMostrarModal(true);
  };

  // Cargar tareas cuando se activa la sección
  useEffect(() => {
    if (seccionActiva === "tareas") {
      obtenerTareas();
    }
  }, [seccionActiva]);

  //-----------------------------------------------------------------------------------------------------------
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
              <button className="btn-logout" onClick={handleLogout}>
                Cerrar sesión
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
                <button className="btn-primary" onClick={abrirModalCrearSolicitud}>
                  ➕ Nuevo Solicitud
                </button>
              </div>
              <div className="tabla-contenedor">
                <table className="tabla-usuarios">
                  <thead>
                    <tr>
                      <th>Solicitante</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th>Tipo de Solicitud</th>
                      <th>Categoría</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Observaciones</th>
                      <th>Fecha Solicitud</th>
                      <th>Responsable</th>
                      <th>Modificado Por</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitudes.map((sol) => (
                      <tr key={sol._id}>
                        <td>

                          {sol.solicitante?.username || sol.solicitante || "N/A"}

                        </td>
                        <td>
                          {/* Si solicitante es objeto, muestra el email, si no, el campo email */}
                          {sol.solicitante?.email || sol.email || "N/A"}
                        </td>
                        <td>{sol.telefono || "N/A"}</td>
                        <td>{sol.tipoSolicitud || "N/A"}</td>
                        <td>
                          {/* Si categoria es objeto, muestra el nombre, si no, el valor */}
                          {sol.categoria?.nombre || sol.categoria || "N/A"}
                        </td>
                        <td>{sol.descripcion || "N/A"}</td>
                        <td>{sol.estado || "N/A"}</td>
                        <td>{sol.prioridad || "N/A"}</td>
                        <td>{sol.observaciones || "N/A"}</td>
                        <td>{sol.fechaSolicitud ? new Date(sol.fechaSolicitud).toLocaleDateString() : "N/A"}</td>
                        <td>
                          {/* Si responsable es objeto, muestra el nombre, si no, el valor */}
                          {sol.responsable?.username || sol.responsable || "N/A"}

                        </td>
                        <td>{sol.modificadoPor || "N/A"}</td>
                        <td>
                          <button className="btn-editar" onClick={() => abrirModalEditarSolicitud(sol)}>✏️</button>
                          <button className="btn-eliminar" onClick={() => eliminarSolicitud(sol._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
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
                <button className="btn-primary" onClick={abrirModalCrearInscripcion}>
                  ➕ Nueva Inscripción
                </button>
              </div>
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
                    {inscripciones.map((ins) => (
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
                          <button className="btn-editar" onClick={() => abrirModalEditarInscripcion(ins)}>✏️</button>
                          <button className="btn-eliminar" onClick={() => eliminarInscripcion(ins._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {seccionActiva === "eventos" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Eventos</h2>
                <button className="btn-primary" onClick={abrirModalCrearEvento}>
                  ➕ Nuevo Evento
                </button>
              </div>

              <div className="tabla-contenedor">
                <table className="tabla-usuarios">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Categoría</th>
                      <th>SubCategoría</th>
                      <th>Prioridad</th>
                      <th>Estado</th>
                      <th>Etiquetas</th>
                      <th>Fecha Creación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventos.map((evento) => (
                      <tr key={evento._id}>
                        <td>{evento._id}</td>
                        <td>{evento.name}</td>
                        <td>{evento.description?.substring(0, 50)}...</td>
                        <td>${evento.price?.toLocaleString()}</td>
                        <td>{evento.categoria?.nombre || "Sin categoría"}</td>
                        <td>{evento.subCategoria || "N/A"}</td>
                        <td>
                          <span className={`badge-prioridad prioridad-${evento.prioridad?.toLowerCase()}`}>
                            {evento.prioridad}
                          </span>
                        </td>
                        <td>
                          <span className={`badge-estado estado-${evento.active ? "activo" : "inactivo"}`}>
                            {evento.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          {evento.etiquetas?.slice(0, 2).join(", ")}
                          {evento.etiquetas?.length > 2 && "..."}
                        </td>
                        <td>{evento.createdAt ? new Date(evento.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td>
                          <div className="acciones-botones">
                            <button className="btn-editar" onClick={() => abrirModalEditarEvento(evento)}>
                              ✏️
                            </button>
                            <button className="btn-warning" onClick={() => deshabilitarEvento(evento._id)}>
                              ⏸️
                            </button>
                            <button className="btn-eliminar" onClick={() => eliminarEvento(evento._id)}>
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
          )}
          {seccionActiva === "tareas" && (
            <div className="seccion-usuarios">
              <div className="seccion-header">
                <h2>Gestión de Tareas</h2>
                <button className="btn-primary" onClick={abrirModalCrearTarea}>
                  ➕ Nueva Tarea
                </button>
              </div>

              <div className="tabla-contenedor">
                <table className="tabla-usuarios">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Asignado A</th>
                      <th>Asignado Por</th>
                      <th>Fecha Límite</th>
                      <th>Fecha Creación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tareas.map((tarea) => (
                      <tr key={tarea._id}>
                        <td>{tarea._id}</td>
                        <td>{tarea.titulo}</td>
                        <td>{tarea.descripcion?.substring(0, 50)}...</td>
                        <td>
                          <select
                            value={tarea.estado}
                            onChange={(e) => cambiarEstadoTarea(tarea._id, e.target.value)}
                            className={`badge-estado estado-${tarea.estado?.replace(' ', '-')}`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en progreso">En Progreso</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        </td>
                        <td>
                          <span className={`badge-prioridad prioridad-${tarea.prioridad}`}>
                            {tarea.prioridad?.charAt(0).toUpperCase() + tarea.prioridad?.slice(1)}
                          </span>
                        </td>
                        <td>{tarea.asignadoA?.username || "N/A"}</td>
                        <td>{tarea.asignadoPor?.username || "N/A"}</td>
                        <td>
                          {tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : "N/A"}
                        </td>
                        <td>
                          {tarea.createdAt ? new Date(tarea.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td>
                          <div className="acciones-botones">
                            <button className="btn-editar" onClick={() => abrirModalEditarTarea(tarea)}>
                              ✏️
                            </button>
                            <button className="btn-eliminar" onClick={() => eliminarTarea(tarea._id)}>
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

      {mostrarModal && seccionActiva === "solicitudes" && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modoEdicionSolicitud ? "Editar Solicitud" : "Crear Nueva Solicitud"}</h3>
              <button className="modal-cerrar" onClick={() => setMostrarModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grupo">
                <label>Solicitante:</label>
                <input
                  type="text"
                  value={modoEdicionSolicitud ? solicitudSeleccionada?.solicitante : nuevaSolicitud.solicitante}
                  onChange={e =>
                    modoEdicionSolicitud
                      ? setSolicitudSeleccionada({ ...solicitudSeleccionada, solicitante: e.target.value })
                      : setNuevaSolicitud({ ...nuevaSolicitud, solicitante: e.target.value })
                  }
                  placeholder="Nombre del solicitante"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Email:</label>
                <input
                  type="email"
                  value={modoEdicionSolicitud ? solicitudSeleccionada?.email : nuevaSolicitud.email}
                  onChange={e =>
                    modoEdicionSolicitud
                      ? setSolicitudSeleccionada({ ...solicitudSeleccionada, email: e.target.value })
                      : setNuevaSolicitud({ ...nuevaSolicitud, email: e.target.value })
                  }
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Teléfono:</label>
                <input
                  type="text"
                  value={modoEdicionSolicitud ? solicitudSeleccionada?.telefono : nuevaSolicitud.telefono}
                  onChange={e =>
                    modoEdicionSolicitud
                      ? setSolicitudSeleccionada({ ...solicitudSeleccionada, telefono: e.target.value })
                      : setNuevaSolicitud({ ...nuevaSolicitud, telefono: e.target.value })
                  }
                  placeholder="Teléfono"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Tipo de Solicitud:</label>
                <input
                  type="text"
                  value={modoEdicionSolicitud ? solicitudSeleccionada?.tipoSolicitud : nuevaSolicitud.tipoSolicitud}
                  onChange={e =>
                    modoEdicionSolicitud
                      ? setSolicitudSeleccionada({ ...solicitudSeleccionada, tipoSolicitud: e.target.value })
                      : setNuevaSolicitud({ ...nuevaSolicitud, tipoSolicitud: e.target.value })
                  }
                  placeholder="Tipo"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Categoría:</label>
                <input
                  type="text"
                  value={modoEdicionSolicitud ? solicitudSeleccionada?.categoria : nuevaSolicitud.categoria}
                  onChange={e =>
                    modoEdicionSolicitud
                      ? setSolicitudSeleccionada({ ...solicitudSeleccionada, categoria: e.target.value })
                      : setNuevaSolicitud({ ...nuevaSolicitud, categoria: e.target.value })
                  }
                  placeholder="Categoría"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Descripción:</label>
                <input
                  type="text"
                  value={modoEdicionSolicitud ? solicitudSeleccionada?.descripcion : nuevaSolicitud.descripcion}
                  onChange={e =>
                    modoEdicionSolicitud
                      ? setSolicitudSeleccionada({ ...solicitudSeleccionada, descripcion: e.target.value })
                      : setNuevaSolicitud({ ...nuevaSolicitud, descripcion: e.target.value })
                  }
                  placeholder="Descripción"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Prioridad:</label>
                <select
                  value={modoEdicionSolicitud ? solicitudSeleccionada?.prioridad : nuevaSolicitud.prioridad}
                  onChange={e =>
                    modoEdicionSolicitud
                      ? setSolicitudSeleccionada({ ...solicitudSeleccionada, prioridad: e.target.value })
                      : setNuevaSolicitud({ ...nuevaSolicitud, prioridad: e.target.value })
                  }
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div className="form-grupo">
                <label>Responsable:</label>
                <input
                  type="text"
                  value={modoEdicionSolicitud ? solicitudSeleccionada?.responsable : nuevaSolicitud.responsable}
                  onChange={e =>
                    modoEdicionSolicitud
                      ? setSolicitudSeleccionada({ ...solicitudSeleccionada, responsable: e.target.value })
                      : setNuevaSolicitud({ ...nuevaSolicitud, responsable: e.target.value })
                  }
                  placeholder="Responsable"
                />
              </div>
              <div className="form-grupo">
                <label>Observaciones:</label>
                <input
                  type="text"
                  value={modoEdicionSolicitud ? solicitudSeleccionada?.observaciones : nuevaSolicitud.observaciones}
                  onChange={e =>
                    modoEdicionSolicitud
                      ? setSolicitudSeleccionada({ ...solicitudSeleccionada, observaciones: e.target.value })
                      : setNuevaSolicitud({ ...nuevaSolicitud, observaciones: e.target.value })
                  }
                  placeholder="Observaciones"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={modoEdicionSolicitud ? actualizarSolicitud : crearSolicitud}
              >
                {modoEdicionSolicitud ? "Guardar Cambios" : "Crear Solicitud"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Eventos */}
      {mostrarModal && seccionActiva === "eventos" && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modoEdicionEvento ? "Editar Evento" : "Crear Nuevo Evento"}</h3>
              <button className="modal-cerrar" onClick={() => setMostrarModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grupo">
                <label>Nombre del Evento:</label>
                <input
                  type="text"
                  value={modoEdicionEvento ? eventoSeleccionado?.name : nuevoEvento.name}
                  onChange={e =>
                    modoEdicionEvento
                      ? setEventoSeleccionado({ ...eventoSeleccionado, name: e.target.value })
                      : setNuevoEvento({ ...nuevoEvento, name: e.target.value })
                  }
                  placeholder="Nombre del evento"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Descripción:</label>
                <textarea
                  value={modoEdicionEvento ? eventoSeleccionado?.description : nuevoEvento.description}
                  onChange={e =>
                    modoEdicionEvento
                      ? setEventoSeleccionado({ ...eventoSeleccionado, description: e.target.value })
                      : setNuevoEvento({ ...nuevoEvento, description: e.target.value })
                  }
                  placeholder="Descripción del evento"
                  rows="3"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Precio:</label>
                <input
                  type="number"
                  value={modoEdicionEvento ? eventoSeleccionado?.price : nuevoEvento.price}
                  onChange={e =>
                    modoEdicionEvento
                      ? setEventoSeleccionado({ ...eventoSeleccionado, price: Number(e.target.value) })
                      : setNuevoEvento({ ...nuevoEvento, price: Number(e.target.value) })
                  }
                  placeholder="Precio"
                  min="0"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Categoría (ID):</label>
                <input
                  type="text"
                  value={modoEdicionEvento ? eventoSeleccionado?.categoria : nuevoEvento.categoria}
                  onChange={e =>
                    modoEdicionEvento
                      ? setEventoSeleccionado({ ...eventoSeleccionado, categoria: e.target.value })
                      : setNuevoEvento({ ...nuevoEvento, categoria: e.target.value })
                  }
                  placeholder="ID de la categoría"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>SubCategoría:</label>
                <input
                  type="text"
                  value={modoEdicionEvento ? eventoSeleccionado?.subCategoria : nuevoEvento.subCategoria}
                  onChange={e =>
                    modoEdicionEvento
                      ? setEventoSeleccionado({ ...eventoSeleccionado, subCategoria: e.target.value })
                      : setNuevoEvento({ ...nuevoEvento, subCategoria: e.target.value })
                  }
                  placeholder="SubCategoría"
                />
              </div>
              <div className="form-grupo">
                <label>Etiquetas (separadas por coma):</label>
                <input
                  type="text"
                  value={modoEdicionEvento ? 
                    (eventoSeleccionado?.etiquetas || []).join(", ") : 
                    (nuevoEvento.etiquetas || []).join(", ")
                  }
                  onChange={e => {
                    const etiquetas = e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag);
                    modoEdicionEvento
                      ? setEventoSeleccionado({ ...eventoSeleccionado, etiquetas: etiquetas })
                      : setNuevoEvento({ ...nuevoEvento, etiquetas: etiquetas });
                  }}
                  placeholder="etiqueta1, etiqueta2, etiqueta3"
                />
              </div>
              <div className="form-grupo">
                <label>URL de Imagen:</label>
                <input
                  type="text"
                  value={modoEdicionEvento ? eventoSeleccionado?.images : nuevoEvento.images}
                  onChange={e =>
                    modoEdicionEvento
                      ? setEventoSeleccionado({ ...eventoSeleccionado, images: e.target.value })
                      : setNuevoEvento({ ...nuevoEvento, images: e.target.value })
                  }
                  placeholder="URL de la imagen"
                />
              </div>
              <div className="form-grupo">
                <label>Prioridad:</label>
                <select
                  value={modoEdicionEvento ? eventoSeleccionado?.prioridad : nuevoEvento.prioridad}
                  onChange={e =>
                    modoEdicionEvento
                      ? setEventoSeleccionado({ ...eventoSeleccionado, prioridad: e.target.value })
                      : setNuevoEvento({ ...nuevoEvento, prioridad: e.target.value })
                  }
                >
                  <option value="Alta">Alta</option>
                  <option value="Normal">Normal</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div className="form-grupo">
                <label>Observaciones:</label>
                <textarea
                  value={modoEdicionEvento ? eventoSeleccionado?.observaciones : nuevoEvento.observaciones}
                  onChange={e =>
                    modoEdicionEvento
                      ? setEventoSeleccionado({ ...eventoSeleccionado, observaciones: e.target.value })
                      : setNuevoEvento({ ...nuevoEvento, observaciones: e.target.value })
                  }
                  placeholder="Observaciones adicionales"
                  rows="2"
                />
              </div>
              {modoEdicionEvento && (
                <div className="form-grupo">
                  <label>Estado:</label>
                  <select
                    value={eventoSeleccionado?.active ? "true" : "false"}
                    onChange={e => setEventoSeleccionado({ 
                      ...eventoSeleccionado, 
                      active: e.target.value === "true" 
                    })}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={modoEdicionEvento ? actualizarEvento : crearEvento}
              >
                {modoEdicionEvento ? "Guardar Cambios" : "Crear Evento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Tareas */}
      {mostrarModal && seccionActiva === "tareas" && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modoEdicionTarea ? "Editar Tarea" : "Crear Nueva Tarea"}</h3>
              <button className="modal-cerrar" onClick={() => setMostrarModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grupo">
                <label>Título de la Tarea:</label>
                <input
                  type="text"
                  value={modoEdicionTarea ? tareaSeleccionada?.titulo : nuevaTarea.titulo}
                  onChange={e =>
                    modoEdicionTarea
                      ? setTareaSeleccionada({ ...tareaSeleccionada, titulo: e.target.value })
                      : setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })
                  }
                  placeholder="Título de la tarea"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Descripción:</label>
                <textarea
                  value={modoEdicionTarea ? tareaSeleccionada?.descripcion : nuevaTarea.descripcion}
                  onChange={e =>
                    modoEdicionTarea
                      ? setTareaSeleccionada({ ...tareaSeleccionada, descripcion: e.target.value })
                      : setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })
                  }
                  placeholder="Descripción detallada de la tarea"
                  rows="3"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Estado:</label>
                <select
                  value={modoEdicionTarea ? tareaSeleccionada?.estado : nuevaTarea.estado}
                  onChange={e =>
                    modoEdicionTarea
                      ? setTareaSeleccionada({ ...tareaSeleccionada, estado: e.target.value })
                      : setNuevaTarea({ ...nuevaTarea, estado: e.target.value })
                  }
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="form-grupo">
                <label>Prioridad:</label>
                <select
                  value={modoEdicionTarea ? tareaSeleccionada?.prioridad : nuevaTarea.prioridad}
                  onChange={e =>
                    modoEdicionTarea
                      ? setTareaSeleccionada({ ...tareaSeleccionada, prioridad: e.target.value })
                      : setNuevaTarea({ ...nuevaTarea, prioridad: e.target.value })
                  }
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <div className="form-grupo">
                <label>Asignado A (ID del Usuario):</label>
                <input
                  type="text"
                  value={modoEdicionTarea ? tareaSeleccionada?.asignadoA : nuevaTarea.asignadoA}
                  onChange={e =>
                    modoEdicionTarea
                      ? setTareaSeleccionada({ ...tareaSeleccionada, asignadoA: e.target.value })
                      : setNuevaTarea({ ...nuevaTarea, asignadoA: e.target.value })
                  }
                  placeholder="ID del usuario a quien se asigna"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Asignado Por (ID del Usuario):</label>
                <input
                  type="text"
                  value={modoEdicionTarea ? tareaSeleccionada?.asignadoPor : nuevaTarea.asignadoPor}
                  onChange={e =>
                    modoEdicionTarea
                      ? setTareaSeleccionada({ ...tareaSeleccionada, asignadoPor: e.target.value })
                      : setNuevaTarea({ ...nuevaTarea, asignadoPor: e.target.value })
                  }
                  placeholder="ID del usuario que asigna"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Fecha Límite:</label>
                <input
                  type="date"
                  value={modoEdicionTarea ? tareaSeleccionada?.fechaLimite : nuevaTarea.fechaLimite}
                  onChange={e =>
                    modoEdicionTarea
                      ? setTareaSeleccionada({ ...tareaSeleccionada, fechaLimite: e.target.value })
                      : setNuevaTarea({ ...nuevaTarea, fechaLimite: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={modoEdicionTarea ? actualizarTarea : crearTarea}
              >
                {modoEdicionTarea ? "Guardar Cambios" : "Crear Tarea"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
export default Dashboard