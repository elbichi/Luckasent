const Inscripcion = require('../models/Inscripciones');

// Crear inscripción
exports.crearInscripcion = async (req, res) => {
    try {
    const inscripcion = new Inscripcion(req.body);
    await inscripcion.save();
    res.status(201).json({ success: true, data: inscripcion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Obtener todas las inscripciones
exports.obtenerInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find()
      .populate('usuario', 'username email')
      .populate('evento', 'nombre fecha');
    res.json({ success: true, data: inscripciones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener inscripción por ID
exports.obtenerInscripcionPorId = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id)
      .populate('usuario', 'username email')
      .populate('evento', 'nombre fecha');
    if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
    res.json({ success: true, data: inscripcion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar inscripción
exports.actualizarInscripcion = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
    res.json({ success: true, data: inscripcion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Eliminar inscripción
exports.eliminarInscripcion = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByIdAndDelete(req.params.id);
    if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
    res.json({ success: true, message: 'Inscripción eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};