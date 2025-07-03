const Evento = require('../models/Eventos');
const Categorizacion = require('../models/categorizacion');
const Usuario = require('../models/User');
const mongoose = require('mongoose');

// Obtener todos los eventos
exports.getAllEvents = async (req, res) => {
  try {
    console.log('[EVENTOS] Consultando eventos para usuario:', req.userRole, 'ID:', req.userId);
    
    // Para seminaristas, solo mostrar eventos activos
    // Para admin y tesorero, mostrar todos los eventos
    let filtro = {};
    if (req.userRole === 'seminarista') {
      filtro = { active: true };
    }
    
    const events = await Evento.find(filtro).populate('categoria');
    console.log('[EVENTOS] Eventos encontrados para rol', req.userRole, ':', events.length);
    
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('[EVENTOS] Error al obtener eventos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener eventos', error: error.message });
  }
};

// Obtener evento por ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Evento.findById(req.params.id).populate('categoria');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener evento', error: error.message });
  }
};

// Crear nuevo evento
exports.createEvent = async (req, res) => {
  try {
    // Extraer solo los campos en español, ignorando campos en inglés
    const { 
      nombre,
      descripcion,
      imagen,
      precio,
      categoria,
      etiquetas,
      fechaEvento,
      horaInicio,
      horaFin,
      lugar,
      direccion,
      duracionDias,
      cuposTotales,
      cuposDisponibles,
      programa,
      prioridad,
      observaciones,
      categorizadoPor,
      fechaCategorizacion,
      active 
    } = req.body;

    // Validar campos obligatorios
    if (!nombre) {
      return res.status(400).json({ success: false, message: 'El nombre es obligatorio' });
    }
    if (!descripcion) {
      return res.status(400).json({ success: false, message: 'La descripción es obligatoria' });
    }
    if (precio === undefined || precio === null) {
      return res.status(400).json({ success: false, message: 'El precio es obligatorio' });
    }

    // Validar que categoria sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(categoria)) {
      return res.status(400).json({ success: false, message: 'ID de categoría inválido.' });
    }
    // Validar que categorizadoPor sea un ObjectId válido si viene en el body
    if (categorizadoPor && !mongoose.Types.ObjectId.isValid(categorizadoPor)) {
      return res.status(400).json({ success: false, message: 'ID de usuario categorizador inválido.' });
    }

    // Verificar que la categoría exista
    const categoriaExiste = await Categorizacion.findById(categoria);
    if (!categoriaExiste) {
      return res.status(404).json({ success: false, message: 'La categoría no existe.' });
    }

    // Verificar que el usuario categorizadoPor exista (si viene en el body)
    if (categorizadoPor) {
      const usuarioExiste = await Usuario.findById(categorizadoPor);
      if (!usuarioExiste) {
        return res.status(404).json({ success: false, message: 'El usuario categorizador no existe.' });
      }
    }

    // Crear el evento
    const event = new Evento({
      nombre,
      descripcion,
      imagen,
      precio,
      categoria,
      etiquetas,
      fechaEvento,
      horaInicio,
      horaFin,
      lugar,
      direccion,
      duracionDias,
      cuposTotales,
      cuposDisponibles,
      programa,
      prioridad,
      observaciones,
      categorizadoPor,
      fechaCategorizacion,
      active
    });
    const savedEvent = await event.save();
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear evento', error: error.message });
  }
};

// Actualizar evento
exports.updateEvent = async (req, res) => {
  try {
    console.log('[EVENTOS] updateEvent - ID:', req.params.id);
    console.log('[EVENTOS] updateEvent - Datos recibidos:', JSON.stringify(req.body, null, 2));
    console.log('[EVENTOS] updateEvent - Usuario:', req.userId, 'Role:', req.userRole);
    
    // Primero obtenemos el evento actual para comparar
    const currentEvent = await Evento.findById(req.params.id);
    if (!currentEvent) {
      console.log('[EVENTOS] updateEvent - Evento no encontrado');
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    
    console.log('[EVENTOS] updateEvent - Evento actual nombre:', currentEvent.nombre);
    console.log('[EVENTOS] updateEvent - Nuevo nombre:', req.body.nombre);
    console.log('[EVENTOS] updateEvent - Nombres son iguales:', currentEvent.nombre === req.body.nombre);
    
    // Si el nombre no ha cambiado, lo excluimos de la actualización para evitar conflictos de unique
    const updateData = { ...req.body };
    if (updateData.nombre === currentEvent.nombre) {
      delete updateData.nombre;
      console.log('[EVENTOS] updateEvent - Nombre no cambió, excluyendo de actualización');
    } else {
      console.log('[EVENTOS] updateEvent - Nombre cambió, manteniendo en actualización');
      // Verificar si el nuevo nombre ya existe en otro evento
      const existingEvent = await Evento.findOne({ 
        nombre: updateData.nombre, 
        _id: { $ne: req.params.id } 
      });
      if (existingEvent) {
        console.log('[EVENTOS] updateEvent - Ya existe otro evento con ese nombre');
        return res.status(400).json({
          success: false,
          message: 'Ya existe un evento con ese nombre',
          field: 'nombre'
        });
      }
    }
    
    console.log('[EVENTOS] updateEvent - Datos finales para actualización:', JSON.stringify(updateData, null, 2));
    
    const updatedEvent = await Evento.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    console.log('[EVENTOS] updateEvent - Evento actualizado exitosamente');
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error('[EVENTOS] updateEvent - Error:', error.message);
    console.error('[EVENTOS] updateEvent - Stack:', error.stack);
    
    // Manejo específico para errores de duplicado
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Ya existe un evento con ese ${field}`,
        field: field
      });
    }
    
    res.status(500).json({ success: false, message: 'Error al actualizar evento', error: error.message });
  }
};

// Eliminar evento
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Evento.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Evento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar evento', error: error.message });
  }
};

// Deshabilitar evento (solo admin)
exports.disableEvent = async (req, res) => {
  try {
    const event = await Evento.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Evento deshabilitado', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al deshabilitar evento', error: error.message });
  }
};

// Categorizar evento
exports.categorizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoria, etiquetas } = req.body;

    // Validación de datos
    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: 'La categoría es requerida'
      });
    }

    // Actualizar evento con la categorización
    const eventoActualizado = await Evento.findByIdAndUpdate(
      id,
      {
        categoria,
        etiquetas,
        categorizadoPor: req.userId,
        fechaCategorizacion: new Date()
      },
      { new: true }
    );

    if (!eventoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Evento categorizado exitosamente',
      data: eventoActualizado
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al categorizar el evento',
      error: error.message
    });
  }
};

// Obtener eventos por categoría
exports.getEventosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.query;

    const filtro = categoria ? { categoria } : {};

    const eventos = await Evento.find(filtro)
      .populate('categorizadoPor', 'username email')
      .sort({ fechaCategorizacion: -1 });

    res.status(200).json({
      success: true,
      data: eventos
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos por categoría',
      error: error.message
    });
  }
};

// Función temporal para activar todos los eventos (solo para testing)
exports.activarTodosLosEventos = async (req, res) => {
  try {
    console.log('[EVENTOS] Activando todos los eventos...');
    const result = await Evento.updateMany({}, { active: true });
    console.log('[EVENTOS] Eventos actualizados:', result.modifiedCount);
    
    // Contar eventos activos después de la actualización
    const eventosActivos = await Evento.countDocuments({ active: true });
    console.log('[EVENTOS] Total de eventos activos ahora:', eventosActivos);
    
    res.status(200).json({ 
      success: true, 
      message: `Se activaron ${result.modifiedCount} eventos. Total activos: ${eventosActivos}`,
      data: { modified: result.modifiedCount, totalActive: eventosActivos }
    });
  } catch (error) {
    console.error('[EVENTOS] Error al activar eventos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al activar eventos', 
      error: error.message 
    });
  }
};

// Método para inicializar eventos de ejemplo
exports.initializeEventosEjemplo = async (req, res) => {
  try {
    // Verificar si ya hay eventos
    const eventosExistentes = await Evento.countDocuments();
    
    if (eventosExistentes > 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'Ya existen eventos en la base de datos',
        count: eventosExistentes
      });
    }

    // Buscar una categoría existente o crear una por defecto
    let categoria = await Categorizacion.findOne();
    if (!categoria) {
      categoria = new Categorizacion({
        nombre: 'Eventos Generales',
        descripcion: 'Categoría por defecto para eventos',
        active: true
      });
      await categoria.save();
    }

    // Crear eventos de ejemplo
    const eventosEjemplo = [
      {
        nombre: 'Retiro Espiritual de Adviento',
        descripcion: 'Un tiempo de reflexión y preparación espiritual para el tiempo de Adviento. Incluye meditaciones, oración comunitaria y talleres de formación.',
        imagen: '/images/default-event.svg',
        precio: 0,
        categoria: categoria._id,
        etiquetas: ['retiro', 'adviento', 'espiritual', 'formación'],
        fechaEvento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
        horaInicio: '09:00',
        horaFin: '17:00',
        lugar: 'Capilla del Seminario',
        direccion: 'Seminario Mayor San José',
        duracionDias: 1,
        cuposTotales: 50,
        cuposDisponibles: 50,
        programa: [
          {
            horaInicio: '09:00',
            horaFin: '10:30',
            tema: 'Meditación Matutina',
            descripcion: 'Reflexión sobre los textos del Adviento'
          },
          {
            horaInicio: '11:00',
            horaFin: '12:30',
            tema: 'Conferencia: El Espíritu del Adviento',
            descripcion: 'Charla magistral sobre la preparación navideña'
          },
          {
            horaInicio: '14:00',
            horaFin: '15:30',
            tema: 'Taller de Oración',
            descripcion: 'Ejercicios prácticos de oración contemplativa'
          },
          {
            horaInicio: '16:00',
            horaFin: '17:00',
            tema: 'Celebración Eucarística',
            descripción: 'Misa de cierre del retiro'
          }
        ],
        prioridad: 'Alta',
        observaciones: 'Se requiere puntualidad. Traer cuaderno para apuntes.',
        active: true
      },
      {
        nombre: 'Jornada de Formación Litúrgica',
        descripcion: 'Formación especializada en liturgia y celebración de los sacramentos. Dirigido a seminaristas de años superiores.',
        imagen: '/images/default-event.svg',
        precio: 0,
        categoria: categoria._id,
        etiquetas: ['formación', 'liturgia', 'sacramentos', 'ministerio'],
        fechaEvento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // En 14 días
        horaInicio: '08:00',
        horaFin: '18:00',
        lugar: 'Aula Magna',
        direccion: 'Seminario Mayor San José',
        duracionDias: 2,
        cuposTotales: 30,
        cuposDisponibles: 30,
        programa: [
          {
            horaInicio: '08:00',
            horaFin: '09:30',
            tema: 'Fundamentos de la Liturgia',
            descripcion: 'Bases teológicas y históricas'
          },
          {
            horaInicio: '10:00',
            horaFin: '11:30',
            tema: 'Celebración de la Eucaristía',
            descripcion: 'Aspectos prácticos y espirituales'
          },
          {
            horaInicio: '14:00',
            horaFin: '15:30',
            tema: 'Sacramentos de Iniciación',
            descripcion: 'Bautismo, Confirmación y Eucaristía'
          },
          {
            horaInicio: '16:00',
            horaFin: '17:30',
            tema: 'Práctica Liturgica',
            descripcion: 'Ejercicios prácticos de celebración'
          }
        ],
        prioridad: 'Normal',
        observaciones: 'Dirigido a seminaristas de 3er año en adelante.',
        active: true
      },
      {
        nombre: 'Conferencia: "Vocación y Misión"',
        descripcion: 'Conferencia magistral sobre el discernimiento vocacional y la misión evangelizadora de la Iglesia.',
        imagen: '/images/default-event.svg',
        precio: 0,
        categoria: categoria._id,
        etiquetas: ['conferencia', 'vocación', 'misión', 'evangelización'],
        fechaEvento: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // En 21 días
        horaInicio: '19:00',
        horaFin: '21:00',
        lugar: 'Auditorio Principal',
        direccion: 'Seminario Mayor San José',
        duracionDias: 1,
        cuposTotales: 100,
        cuposDisponibles: 100,
        programa: [
          {
            horaInicio: '19:00',
            horaFin: '20:00',
            tema: 'Conferencia Magistral',
            descripcion: 'Vocación y Misión en el mundo contemporáneo'
          },
          {
            horaInicio: '20:00',
            horaFin: '21:00',
            tema: 'Mesa Redonda',
            descripcion: 'Preguntas y respuestas con el conferencista'
          }
        ],
        prioridad: 'Alta',
        observaciones: 'Abierto a toda la comunidad del seminario.',
        active: true
      },
      {
        nombre: 'Taller de Música Sacra',
        descripcion: 'Taller práctico de música y canto litúrgico para mejorar la participación en las celebraciones.',
        imagen: '/images/default-event.svg',
        precio: 0,
        categoria: categoria._id,
        etiquetas: ['música', 'canto', 'liturgia', 'taller'],
        fechaEvento: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // En 28 días
        horaInicio: '15:00',
        horaFin: '17:00',
        lugar: 'Sala de Música',
        direccion: 'Seminario Mayor San José',
        duracionDias: 3,
        cuposTotales: 25,
        cuposDisponibles: 25,
        programa: [
          {
            horaInicio: '15:00',
            horaFin: '16:00',
            tema: 'Técnica Vocal',
            descripcion: 'Ejercicios de respiración y vocalización'
          },
          {
            horaInicio: '16:00',
            horaFin: '17:00',
            tema: 'Repertorio Litúrgico',
            descripcion: 'Aprendizaje de cantos para la liturgia'
          }
        ],
        prioridad: 'Normal',
        observaciones: 'No se requiere experiencia previa en música.',
        active: true
      }
    ];

    // Insertar eventos en la base de datos
    const eventosCreados = await Evento.insertMany(eventosEjemplo);
    
    console.log('[EVENTOS] Se crearon eventos de ejemplo:', eventosCreados.length);
    
    res.status(201).json({
      success: true,
      message: `Se crearon ${eventosCreados.length} eventos de ejemplo`,
      data: eventosCreados
    });
    
  } catch (error) {
    console.error('[EVENTOS] Error al inicializar eventos de ejemplo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al inicializar eventos de ejemplo',
      error: error.message
    });
  }
};

// Método para limpiar campos duplicados en eventos
exports.limpiarCamposDuplicados = async (req, res) => {
  try {
    console.log('[EVENTOS] Iniciando limpieza de campos duplicados...');
    
    // Buscar todos los eventos que tengan campos en inglés
    const eventos = await Evento.find({
      $or: [
        { name: { $exists: true } },
        { description: { $exists: true } },
        { price: { $exists: true } }
      ]
    });
    
    console.log(`[EVENTOS] Se encontraron ${eventos.length} eventos con campos duplicados`);
    
    let eventosActualizados = 0;
    
    for (const evento of eventos) {
      const actualizaciones = {};
      const camposAEliminar = {};
      
      // Si tiene 'name' pero no 'nombre', mover el valor
      if (evento.name && !evento.nombre) {
        actualizaciones.nombre = evento.name;
      }
      
      // Si tiene 'description' pero no 'descripcion', mover el valor
      if (evento.description && !evento.descripcion) {
        actualizaciones.descripcion = evento.description;
      }
      
      // Si tiene 'price' pero no 'precio', mover el valor
      if (evento.price && !evento.precio) {
        actualizaciones.precio = evento.price;
      }
      
      // Marcar campos en inglés para eliminar
      if (evento.name) camposAEliminar.name = "";
      if (evento.description) camposAEliminar.description = "";
      if (evento.price) camposAEliminar.price = "";
      
      // Actualizar el evento si hay cambios
      if (Object.keys(actualizaciones).length > 0 || Object.keys(camposAEliminar).length > 0) {
        await Evento.findByIdAndUpdate(
          evento._id,
          {
            $set: actualizaciones,
            $unset: camposAEliminar
          }
        );
        eventosActualizados++;
        console.log(`[EVENTOS] Evento actualizado: ${evento._id}`);
      }
    }
    
    console.log(`[EVENTOS] Se actualizaron ${eventosActualizados} eventos`);
    
    res.status(200).json({
      success: true,
      message: `Se limpiaron ${eventosActualizados} eventos con campos duplicados`,
      eventosEncontrados: eventos.length,
      eventosActualizados: eventosActualizados
    });
    
  } catch (error) {
    console.error('[EVENTOS] Error al limpiar campos duplicados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al limpiar campos duplicados',
      error: error.message
    });
  }
};