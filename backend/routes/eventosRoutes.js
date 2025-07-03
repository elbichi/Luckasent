const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { authJwt, role } = require('../middlewares');
const { filtrarCamposEvento } = require('../middlewares/filtrarCampos');
const { body } = require('express-validator');

// Validaciones para el evento
const validarEvento = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  body('precio').isNumeric().withMessage('El precio debe ser numérico'),
  body('categoria').isMongoId().withMessage('ID de categoría inválido')
];

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (todos los roles autenticados)
router.get('/', eventosController.getAllEvents);
router.get('/:id', eventosController.getEventById);
router.get('/categoria', eventosController.getEventosPorCategoria);

// Ruta para inicializar eventos de ejemplo (solo admin)
router.post('/inicializar-ejemplo', role.isAdmin, eventosController.initializeEventosEjemplo);

// Ruta para limpiar campos duplicados (solo admin)
router.patch('/limpiar-campos', role.isAdmin, eventosController.limpiarCamposDuplicados);

// Ruta temporal para activar todos los eventos (solo admin)
router.patch('/activar-todos', role.isAdmin, eventosController.activarTodosLosEventos);

// Rutas de creación y modificación (admin y tesorero)
router.post('/', role.checkRole('admin', 'tesorero'), filtrarCamposEvento, validarEvento, eventosController.createEvent);
router.put('/:id', role.checkRole('admin', 'tesorero'), filtrarCamposEvento, eventosController.updateEvent);
router.patch('/:id/disable', role.checkRole('admin', 'tesorero'), eventosController.disableEvent);
router.patch('/:id/categorizar', role.checkRole('admin', 'tesorero'), eventosController.categorizarEvento);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, eventosController.deleteEvent);
module.exports = router;