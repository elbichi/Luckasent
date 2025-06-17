const express = require('express');
const router = express.Router();

// Importar controladores
const {
  obtenerSolicitudesParaCategorizar,
  obtenerEstadisticas,
  obtenerSolicitudPorId,
  categorizarSolicitud,
  categorizarLote,
  eliminarCategorizacion,
  obtenerHistorialCategorizacion
} = require('../controllers/csolicitudController');

// Importar middlewares
const { verifyToken } = require('../middlewares/authJwt');
const { isAdmin } = require('../middlewares/role');

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

// RUTAS PARA CU03 - CATEGORIZAR SOLICITUDES

/**
 * @route   GET /api/categorizacion/solicitudes
 * @desc    Obtener solicitudes para categorizar con filtros y paginación
 * @access  Admin, Organizador
 * @query   page, limit, estado, categoria, prioridad, tipoParticipante, busqueda
 */
router.get('/solicitudes', isAdmin, obtenerSolicitudesParaCategorizar);

/**
 * @route   GET /api/categorizacion/estadisticas
 * @desc    Obtener estadísticas de categorización
 * @access  Admin, Organizador
 */
router.get('/estadisticas', isAdmin, obtenerEstadisticas);

/**
 * @route   GET /api/categorizacion/solicitud/:id
 * @desc    Obtener una solicitud específica por ID
 * @access  Admin, Organizador
 */
router.get('/solicitud/:id', isAdmin, obtenerSolicitudPorId);

/**
 * @route   PUT /api/categorizacion/categorizar/:id
 * @desc    Categorizar una solicitud específica
 * @access  Admin, Organizador
 * @body    { categoria, prioridad, estado?, observaciones? }
 */
router.put('/categorizar/:id', isAdmin, categorizarSolicitud);

/**
 * @route   PUT /api/categorizacion/categorizar-lote
 * @desc    Categorizar múltiples solicitudes en lote
 * @access  Admin
 * @body    { solicitudes: [ids], categoria, prioridad, observaciones? }
 */
router.put('/categorizar-lote', isAdmin, categorizarLote);

/**
 * @route   DELETE /api/categorizacion/eliminar/:id
 * @desc    Eliminar categorización de una solicitud
 * @access  Admin
 */
router.delete('/eliminar/:id', isAdmin, eliminarCategorizacion);

/**
 * @route   GET /api/categorizacion/historial
 * @desc    Obtener historial de categorizaciones
 * @access  Admin, Organizador
 * @query   page, limit
 */
router.get('/historial', isAdmin, obtenerHistorialCategorizacion);

module.exports = router;