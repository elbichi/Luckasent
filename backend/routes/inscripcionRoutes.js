const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');
const { authJwt } = require('../middlewares');

//pryteger todas las rutas
router.use(authJwt.verifyToken);

// CRUD
router.post('/', inscripcionController.crearInscripcion);
router.get('/', inscripcionController.obtenerInscripciones);
router.get('/:id', inscripcionController.obtenerInscripcionPorId);
router.put('/:id', inscripcionController.actualizarInscripcion);
router.delete('/:id', inscripcionController.eliminarInscripcion);


module.exports = router;