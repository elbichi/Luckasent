// routes/solicitudRoutes.js (fragmento adicional)
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { authJwt } = require('../middlewares');

// Validaciones para crear solicitud
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

// Ruta para crear solicitud
router.post('/', validarSolicitud, solicitudController.crearSolicitud);

module.exports = router;