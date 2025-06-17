// routes/solicitudRoutes.js (fragmento adicional)
const express = require('express');
const router = express.Router();
const Solicitud = require('../models/Solicitud');
// Importar tanto authJwt como role desde middlewares
const { authJwt, role } = require('../middlewares');

// Obtener solicitudes sin categorizar
router.get('/sin-categorizar', 
    authJwt.verifyToken, 
    role.checkRole('admin'), 
    async (req, res) => {
  try {
    const solicitudes = await Solicitud.find({
      estado: 'pendiente'
    })
    .populate('detalles.seminarioId', 'nombre fechaInicio')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: solicitudes,
      total: solicitudes.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes sin categorizar',
      error: error.message
    });
  }
});

// Obtener solicitudes por categoría
router.get('/categoria/:categoriaId', authJwt.verifyToken, role.checkRole('admin'), async (req, res) => {
  try {
    const solicitudes = await Solicitud.find({
      'categoria.id': req.params.categoriaId
    })
    .populate('detalles.seminarioId', 'nombre fechaInicio')
    .populate('categorizadoPor', 'nombre email')
    .sort({ fechaCategorizacion: -1 });

    res.json({
      success: true,
      data: solicitudes,
      total: solicitudes.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes por categoría',
      error: error.message
    });
  }
});

module.exports = router;