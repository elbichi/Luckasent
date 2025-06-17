const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { authJwt, role } = require('../middlewares');

// Listar todos los eventos
router.get('/', eventosController.getAllEvents);
// Obtener evento por ID
router.get('/:id', eventosController.getEventById);
// Crear evento (solo admin y logistico)
router.post('/', [authJwt.verifyToken, role.checkRole('admin', 'logistico')], eventosController.createEvent);
// Actualizar evento (solo admin y logistico)
router.put('/:id', [authJwt.verifyToken, role.checkRole('admin', 'logistico')], eventosController.updateEvent);
// Eliminar evento (solo admin)
router.delete('/:id', [authJwt.verifyToken, role.checkRole('admin')], eventosController.deleteEvent);
// Deshabilitar evento (solo admin)
router.patch('/:id/disable', [authJwt.verifyToken, role.checkRole('admin','logistico','tesorero')], eventosController.disableEvent);
module.exports = router;