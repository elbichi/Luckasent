const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { authJwt } = require('../middlewares');

// Agregar middleware de autenticación
router.use(authJwt.verifyToken);

// CRUD de tareas
router.post('/', tareaController.crearTarea);
router.get('/', tareaController.obtenerTareas);
router.get('/:id', tareaController.obtenerTareaPorId);
router.put('/:id', tareaController.actualizarTarea);
router.delete('/:id', tareaController.eliminarTarea);

module.exports = router;