const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { authJwt, role } = require('../middlewares');
const Inscripcion = require('../models/Inscripciones');
const Reserva = require('../models/Reservas');
const Solicitud = require('../models/Solicitud');

// Validaciones para crear y actualizar solicitud
const validarSolicitud = [
  body('solicitante')
    .trim()
    .notEmpty()
    .withMessage('El nombre del solicitante es requerido'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido'),
  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido'),
  body('tipoSolicitud')
    .isIn(['Inscripción', 'Hospedaje', 'Alimentación', 'Transporte', 'Certificados', 'Administrativa', 'Otra'])
    .withMessage('Tipo de solicitud inválido'),
  body('categoria')
    .isMongoId()
    .withMessage('ID de categoría inválido'),
  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida'),
  body('prioridad')
    .isIn(['Alta', 'Media', 'Baja'])
    .withMessage('Prioridad inválida'),
  body('responsable')
    .isMongoId()
    .withMessage('ID de responsable inválido')
];

// Validación para ID
const validarId = [
  param('id').isMongoId().withMessage('ID inválido')
];

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta - Todos los roles autenticados
router.get('/usuario/mis-solicitudes', solicitudController.obtenerSolicitudesPorUsuario);
router.get('/unificado', async (req, res) => {
  try {
    const solicitudes = await Solicitud.find()
      .populate('solicitante', 'username email')
      .populate('categoria', 'nombre descripcion codigo')
      .populate('responsable', 'username email')
      .lean();

    const inscripciones = await Inscripcion.find()
      .populate('usuario', 'username email')
      .populate('evento', 'name')
      .populate('categoria', 'nombre descripcion codigo')
      .lean();

    const reservas = await Reserva.find()
      .populate('cabana', 'nombre descripcion capacidad categoria estado')
      .lean();

    res.json({
      success: true,
      data: {
        solicitudes,
        inscripciones,
        reservas
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rutas de consulta - Solo admin y tesorero
router.get('/', role.checkRole('admin', 'tesorero'), solicitudController.obtenerSolicitudes);
router.get('/:id', role.checkRole('admin', 'tesorero'), validarId, solicitudController.obtenerSolicitudPorId);

// Rutas de creación - Todos los roles pueden crear solicitudes
router.post('/', validarSolicitud, solicitudController.crearSolicitud);

// Rutas de modificación - Solo admin y tesorero
router.put('/:id', role.checkRole('admin', 'tesorero'), validarId, validarSolicitud, solicitudController.actualizarSolicitud);

// Rutas de eliminación - Solo admin
router.delete('/:id', role.isAdmin, validarId, solicitudController.eliminarSolicitud);

module.exports = router;