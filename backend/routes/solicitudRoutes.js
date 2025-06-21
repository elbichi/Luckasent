const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { authJwt, role } = require('../middlewares');

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

// Solo usuarios autenticados pueden acceder
router.use(authJwt.verifyToken);

// Crear solicitud (roles permitidos)
router.post(
  '/',
  role.checkRole('admin', 'participante', 'seminarista', 'tesorero', 'logistico', 'externo'),
  validarSolicitud,
  solicitudController.crearSolicitud
);

// Consultar todas las solicitudes (admin y logístico)
router.get(
  '/',
  role.checkRole('admin', 'logistico'),
  solicitudController.obtenerSolicitudes
);

// Consultar solicitud por ID (admin y logístico)
router.get(
  '/:id',
  role.checkRole('admin', 'logistico'),
  validarId,
  solicitudController.obtenerSolicitudPorId
);

// Actualizar solicitud (solo admin y logístico)
router.put(
  '/:id',
  role.checkRole('admin', 'logistico'),
  validarId,
  validarSolicitud,
  solicitudController.actualizarSolicitud
);

// Eliminar solicitud (solo admin)
router.delete(
  '/:id',
  role.checkRole('admin'),
  validarId,
  solicitudController.eliminarSolicitud
);

// Consultar solicitudes por usuario autenticado (cada usuario ve sus solicitudes)
router.get(
  '/usuario/mis-solicitudes',
  role.checkRole('participante', 'seminarista', 'tesorero', 'logistico', 'externo'),
  solicitudController.obtenerSolicitudesPorUsuario
);

module.exports = router;