// routes/solicitudRoutes.js (fragmento adicional)
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
// Importar tanto authJwt como role desde middlewares
const { authJwt, role } = require('../middlewares');
// Middleware de validación para crear/actualizar solicitudes
const validarSolicitud = [
  body('solicitante')
    .trim()
    .notEmpty()
    .withMessage('El nombre del solicitante es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .matches(/^[\+]?[0-9\s\-$$$$]{7,15}$/)
    .withMessage('Formato de teléfono inválido'),
  
  body('tipoSolicitud')
    .notEmpty()
    .withMessage('El tipo de solicitud es requerido')
    .isIn(['Inscripción', 'Hospedaje', 'Alimentación', 'Transporte', 'Certificados', 'Ministerio', 'Administrativa', 'Otra'])
    .withMessage('Tipo de solicitud inválido'),
  
  body('categoria')
    .optional()
    .isIn(['Inscripción', 'Hospedaje', 'Alimentación', 'Transporte', 'Certificados', 'Ministerio', 'Administrativa', 'Otra'])
    .withMessage('Categoría inválida'),
  
  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  
  body('prioridad')
    .optional()
    .isIn(['Baja', 'Media', 'Alta', 'Urgente'])
    .withMessage('Prioridad inválida'),
  
  body('observaciones')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres'),
  
  body('responsableAsignado')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre del responsable no puede exceder 100 caracteres')
];

// Validación para actualizar estado
const validarEstado = [
  body('estado')
    .notEmpty()
    .withMessage('El estado es requerido')
    .isIn(['Nueva', 'En Revisión', 'Aprobada', 'Rechazada', 'Completada', 'Pendiente Info'])
    .withMessage('Estado inválido')
];

// Validación para categorizar
const validarCategoria = [
  body('categoria')
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isIn(['Inscripción', 'Hospedaje', 'Alimentación', 'Transporte', 'Certificados', 'Ministerio', 'Administrativa', 'Otra'])
    .withMessage('Categoría inválida')
];


// GET /api/solicitudes - Obtener todas las solicitudes con filtros
router.get('/', obtenerSolicitudes);

// GET /api/solicitudes/estadisticas - Obtener estadísticas por categoría
router.get('/estadisticas', obtenerEstadisticasPorCategoria);

// GET /api/solicitudes/:id - Obtener solicitud por ID
router.get('/:id', obtenerSolicitudPorId);

// POST /api/solicitudes - Crear nueva solicitud
router.post('/', validarSolicitud, crearSolicitud);

// PUT /api/solicitudes/:id - Actualizar solicitud completa
router.put('/:id', validarSolicitud, actualizarSolicitud);

// PATCH /api/solicitudes/:id/categorizar - Categorizar solicitud
router.patch('/:id/categorizar', validarCategoria, categorizarSolicitud);

// PATCH /api/solicitudes/:id/asignar - Asignar responsable
router.patch('/:id/asignar', [
  body('responsableAsignado')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre del responsable no puede exceder 100 caracteres')
], asignarResponsable);

// DELETE /api/solicitudes/:id - Eliminar solicitud
router.delete('/:id', eliminarSolicitud);

module.exports = router;