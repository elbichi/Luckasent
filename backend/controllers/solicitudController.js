const Solicitud = require('../models/Solicitud');


// CU03 - CATEGORIZAR SOLICITUDES

/**
 * Obtener todas las solicitudes para categorizar
 * GET /api/categorizacion/solicitudes
 */
const obtenerSolicitudesParaCategorizar = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      estado,
      categoria,
      prioridad,
      tipoParticipante,
      busqueda
    } = req.query;

    // Construir filtros
    let filtros = { activo: true };

    if (estado && estado !== 'Todos') {
      filtros.estado = estado;
    }

    if (categoria && categoria !== 'Todos') {
      filtros.categoria = categoria;
    }

    if (prioridad && prioridad !== 'Todos') {
      filtros.prioridad = prioridad;
    }

    if (tipoParticipante && tipoParticipante !== 'Todos') {
      filtros.tipoParticipante = tipoParticipante;
    }

    // Búsqueda por texto
    if (busqueda) {
      filtros.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { email: { $regex: busqueda, $options: 'i' } },
        { iglesia: { $regex: busqueda, $options: 'i' } }
      ];
    }

    // Paginación
    const skip = (page - 1) * limit;

    const solicitudes = await Solicitud.find(filtros)
      .populate('categorizadoPor', 'nombre email')
      .populate('respondidoPor', 'nombre email')
      .sort({ fechaSolicitud: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Solicitud.countDocuments(filtros);

    res.status(200).json({
      success: true,
      data: {
        solicitudes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener estadísticas de categorización
 * GET /api/categorizacion/estadisticas
 */
const obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await Solicitud.obtenerEstadisticas();
    
    // Estadísticas adicionales por categoría
    const porCategoria = await Solicitud.aggregate([
      { $match: { activo: true } },
      {
        $group: {
          _id: '$categoria',
          cantidad: { $sum: 1 }
        }
      }
    ]);

    // Estadísticas por prioridad
    const porPrioridad = await Solicitud.aggregate([
      { $match: { activo: true } },
      {
        $group: {
          _id: '$prioridad',
          cantidad: { $sum: 1 }
        }
      }
    ]);

    // Solicitudes categorizadas en los últimos 7 días
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 7);

    const categorizadasRecientes = await Solicitud.countDocuments({
      fechaCategorizacion: { $gte: fechaLimite },
      activo: true
    });

    res.status(200).json({
      success: true,
      data: {
        general: estadisticas[0] || {},
        porCategoria,
        porPrioridad,
        categorizadasRecientes
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener una solicitud específica para categorizar
 * GET /api/categorizacion/solicitud/:id
 */
const obtenerSolicitudPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitud = await Solicitud.findById(id)
      .populate('categorizadoPor', 'nombre email')
      .populate('respondidoPor', 'nombre email');

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: solicitud
    });

  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Categorizar una solicitud
 * PUT /api/categorizacion/categorizar/:id
 */
const categorizarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoria, prioridad, estado, observaciones } = req.body;
    const usuarioId = req.userId; // Del middleware de autenticación

    // Validar datos requeridos
    if (!categoria || !prioridad) {
      return res.status(400).json({
        success: false,
        message: 'Categoría y prioridad son requeridas'
      });
    }

    // Buscar la solicitud
    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    if (!solicitud.activo) {
      return res.status(400).json({
        success: false,
        message: 'No se puede categorizar una solicitud deshabilitada'
      });
    }

    // Aplicar categorización
    solicitud.categoria = categoria;
    solicitud.prioridad = prioridad;
    solicitud.observaciones = observaciones || solicitud.observaciones;
    solicitud.categorizadoPor = usuarioId;
    solicitud.fechaCategorizacion = new Date();

    // Si se proporciona un nuevo estado, actualizarlo
    if (estado && estado !== solicitud.estado) {
      solicitud.estado = estado;
      solicitud.respondidoPor = usuarioId;
      solicitud.fechaRespuesta = new Date();
    }

    await solicitud.save();

    // Poblar los datos para la respuesta
    await solicitud.populate('categorizadoPor', 'nombre email');
    await solicitud.populate('respondidoPor', 'nombre email');

    res.status(200).json({
      success: true,
      message: 'Solicitud categorizada exitosamente',
      data: solicitud
    });

  } catch (error) {
    console.error('Error al categorizar solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Categorizar múltiples solicitudes en lote
 * PUT /api/categorizacion/categorizar-lote
 */
const categorizarLote = async (req, res) => {
  try {
    const { solicitudes, categoria, prioridad, observaciones } = req.body;
    const usuarioId = req.userId;

    if (!solicitudes || !Array.isArray(solicitudes) || solicitudes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de IDs de solicitudes'
      });
    }

    if (!categoria || !prioridad) {
      return res.status(400).json({
        success: false,
        message: 'Categoría y prioridad son requeridas'
      });
    }

    const resultado = await Solicitud.updateMany(
      {
        _id: { $in: solicitudes },
        activo: true
      },
      {
        $set: {
          categoria,
          prioridad,
          observaciones: observaciones || '',
          categorizadoPor: usuarioId,
          fechaCategorizacion: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `${resultado.modifiedCount} solicitudes categorizadas exitosamente`,
      data: {
        solicitudesActualizadas: resultado.modifiedCount,
        solicitudesEncontradas: resultado.matchedCount
      }
    });

  } catch (error) {
    console.error('Error al categorizar lote:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Eliminar categorización (volver a "Sin Categorizar")
 * DELETE /api/categorizacion/eliminar/:id
 */
const eliminarCategorizacion = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Resetear categorización
    solicitud.categoria = 'Sin Categorizar';
    solicitud.prioridad = 'Normal';
    solicitud.observaciones = '';
    solicitud.categorizadoPor = undefined;
    solicitud.fechaCategorizacion = undefined;

    await solicitud.save();

    res.status(200).json({
      success: true,
      message: 'Categorización eliminada exitosamente',
      data: solicitud
    });

  } catch (error) {
    console.error('Error al eliminar categorización:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener historial de categorizaciones
 * GET /api/categorizacion/historial
 */
const obtenerHistorialCategorizacion = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const historial = await Solicitud.find({
      fechaCategorizacion: { $exists: true },
      activo: true
    })
      .populate('categorizadoPor', 'nombre email')
      .select('nombre email categoria prioridad fechaCategorizacion categorizadoPor observaciones')
      .sort({ fechaCategorizacion: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Solicitud.countDocuments({
      fechaCategorizacion: { $exists: true },
      activo: true
    });

    res.status(200).json({
      success: true,
      data: {
        historial,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  obtenerSolicitudesParaCategorizar,
  obtenerEstadisticas,
  obtenerSolicitudPorId,
  categorizarSolicitud,
  categorizarLote,
  eliminarCategorizacion,
  obtenerHistorialCategorizacion
};