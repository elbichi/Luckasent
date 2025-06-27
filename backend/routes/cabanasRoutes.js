const express = require('express');
const router = express.Router();
const { 
  crearCabana, 
  obtenerCabanas,
  obtenerCabanaPorId,
  actualizarCabana,
  eliminarCabana,
  categorizarCabana 
} = require('../controllers/cabanasController');
const { authJwt } = require('../middlewares');

// Middleware de autenticación
router.use(authJwt.verifyToken);

// Rutas
router.post('/', crearCabana);
router.get('/', obtenerCabanas);
router.get('/:id', obtenerCabanaPorId);
router.put('/:id', actualizarCabana);
router.delete('/:id', eliminarCabana);
router.put('/:id/categorizar', categorizarCabana);

module.exports = router;