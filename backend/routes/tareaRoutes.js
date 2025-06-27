const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (todos los roles autenticados)
router.get('/', tareaController.obtenerTareas);
router.get('/:id', tareaController.obtenerTareaPorId);

// Rutas de creación y modificación (admin y tesorero)
router.post('/', role.checkRole('admin', 'tesorero'), tareaController.crearTarea);
router.put('/:id', role.checkRole('admin', 'tesorero'), tareaController.actualizarTarea);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, tareaController.eliminarTarea);

module.exports = router;