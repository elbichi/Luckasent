const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesControllers');
const { authJwt } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de reportes
router.get('/dashboard', reportesController.getDashboardReport);
router.get('/reservas', reportesController.getReservasReport);
router.get('/inscripciones', reportesController.getInscripcionesReport);
router.get('/solicitudes', reportesController.getSolicitudesReport);
router.get('/usuarios', reportesController.getUsuariosReport);
router.get('/eventos', reportesController.getEventosReport);
router.get('/financiero', reportesController.getReporteFinanciero);
router.get('/actividad-usuarios', reportesController.getActividadUsuarios);

module.exports = router;