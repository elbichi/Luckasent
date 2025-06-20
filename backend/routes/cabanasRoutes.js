const express = require('express');
const router = express.Router();
const cabanasController = require('../controllers/cabanasController')
const { authJwt, role } = require('../middlewares');

// Solo autenticados pueden acceder
router.use(authJwt.verifyToken);

// Permitir a todos los roles menos admin (ajusta según tu lógica)
const allowedRoles = ['admin', 'tesorero', 'participante', 'seminarista', 'logistico', 'externo'];

// CRUD
router.post('/', role.checkRole(...allowedRoles), cabanasController.crearCabana);
router.get('/', role.checkRole(...allowedRoles), cabanasController.obtenerCabanas);
router.get('/:id',role.checkRole(...allowedRoles), cabanasController.obtenerCabanaPorId);
router.put('/:id', role.checkRole(...allowedRoles), cabanasController.actualizarCabana);
router.delete('/:id', role.checkRole(...allowedRoles), cabanasController.eliminarCabana);

// Categorizar cabaña
router.patch('/:id/categorizar', role.checkRole(...allowedRoles), cabanasController.categorizarCabana);

module.exports = router;