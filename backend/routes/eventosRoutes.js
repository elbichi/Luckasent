const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { authJwt, role } = require('../middlewares');
const { body } = require('express-validator');

// Validaciones para el evento
const validarEvento = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  body('price').isNumeric().withMessage('El precio debe ser numérico'),
  body('categoria').isMongoId().withMessage('ID de categoría inválido')
];

// Listar todos los eventos
router.get('/', eventosController.getAllEvents);
// Obtener evento por ID
router.get('/:id', eventosController.getEventById);
// Crear evento (solo admin y tesorero)
router.post(
  '/',
  [authJwt.verifyToken, role.checkRole('admin', 'tesorero'), validarEvento],
  eventosController.createEvent
);
// Actualizar evento (solo admin y tesorero)
router.put('/:id', [authJwt.verifyToken, role.checkRole('admin', 'tesorero')], eventosController.updateEvent);
// Eliminar evento (solo admin)
router.delete('/:id', [authJwt.verifyToken, role.checkRole('admin')], eventosController.deleteEvent);
// Deshabilitar evento (solo admin y tesorero)
router.patch('/:id/disable', [authJwt.verifyToken, role.checkRole('admin','tesorero')], eventosController.disableEvent);
// Ruta para categorizar evento
router.patch('/:id/categorizar', 
  [authJwt.verifyToken, role.checkRole('admin', 'tesorero')], 
  eventosController.categorizarEvento
);
// Ruta para obtener eventos por categoría
router.get('/categoria', 
  eventosController.getEventosPorCategoria
);
module.exports = router;