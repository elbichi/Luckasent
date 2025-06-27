const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (todos los roles autenticados)
router.get('/', inscripcionController.obtenerInscripciones);
router.get('/:id', inscripcionController.obtenerInscripcionPorId);

// Rutas de creación y modificación (admin y tesorero)
router.post('/', role.checkRole('admin', 'tesorero'), inscripcionController.crearInscripcion);
router.put('/:id', role.checkRole('admin', 'tesorero'), inscripcionController.actualizarInscripcion);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, inscripcionController.eliminarInscripcion);


module.exports = router;