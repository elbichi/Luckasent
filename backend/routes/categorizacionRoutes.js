const express = require('express');
const router = express.Router();
const { 
  crearCategoria, 
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
  categorizarSolicitud 
} = require('../controllers/categorizacionController');
const { authJwt } = require('../middlewares');

// Middleware de autenticación
router.use(authJwt.verifyToken);

// Rutas
router.post('/', crearCategoria);
router.get('/', obtenerCategorias);
router.get('/:id', obtenerCategoriaPorId);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);
router.put('/solicitud/:id/categorizar', categorizarSolicitud);

module.exports = router;

