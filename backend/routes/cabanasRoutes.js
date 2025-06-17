const express = require('express');
const router = express.Router();
const cabanasController = require('../controllers/cabanasController');
const { authJwt, role } = require('../middlewares');

// Listar todas las cabañas
router.get('/', cabanasController.getAllCabanas);
// Obtener cabaña por ID
router.get('/:id', cabanasController.getCabanaById);
// Crear cabaña (solo admin y logistico)
router.post('/', [authJwt.verifyToken, role.checkRole('admin', 'logistico')], cabanasController.createCabana);
// Actualizar cabaña (solo admin y logistico)
router.put('/:id', [authJwt.verifyToken, role.checkRole('admin', 'logistico','tesorero')], cabanasController.updateCabana);
// Eliminar cabaña (solo admin)
router.delete('/:id', [authJwt.verifyToken, role.checkRole('admin')], cabanasController.deleteCabana);
// Deshabilitar cabaña (solo admin y logistico)
router.patch('/:id/disable', [authJwt.verifyToken, role.checkRole('admin', 'logistico','tesorero')], cabanasController.disableCabana);

module.exports = router;