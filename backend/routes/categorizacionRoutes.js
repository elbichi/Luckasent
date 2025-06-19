const express = require('express');
const router = express.Router();
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
  categorizarSolicitud
} = require('../controllers/categoriaSolicitudController');

// Importar correctamente los middlewares
const { authJwt, role } = require('../middlewares');

// CRUD de Categorías (solo para administradores)
router.post('/', 
  [authJwt.verifyToken, role.checkRole('admin')], 
  crearCategoria
);

router.get('/', 
  [authJwt.verifyToken], 
  obtenerCategorias
);

router.get('/:id', 
  [authJwt.verifyToken, role.checkRole('admin')], 
  obtenerCategoriaPorId
);

router.put('/:id', 
  [authJwt.verifyToken, role.checkRole('admin')], 
  actualizarCategoria
);

router.delete('/:id', 
  [authJwt.verifyToken, role.checkRole('admin')], 
  eliminarCategoria
);

// Categorizar una solicitud específica
router.put('/solicitud/:id/categorizar', 
  [authJwt.verifyToken, role.checkRole('admin')], 
  categorizarSolicitud
);

module.exports = router;

