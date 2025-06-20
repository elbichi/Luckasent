const Cabana = require('../models/Cabana');

// CRUD básico
exports.crearCabana = async (req, res) => {
  try {
    const cabana = new Cabana({ ...req.body, creadoPor: req.userId });
    await cabana.save();
    res.status(201).json({ success: true, data: cabana });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.obtenerCabanas = async (req, res) => {
  try {
    const cabanas = await Cabana.find();
    res.json({ success: true, data: cabanas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.actualizarCabana = async (req, res) => {
  try {
    const cabana = await Cabana.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cabana) return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    res.json({ success: true, data: cabana });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.eliminarCabana = async (req, res) => {
  try {
    const cabana = await Cabana.findByIdAndDelete(req.params.id);
    if (!cabana) return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    res.json({ success: true, message: 'Cabaña eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Categorizar cabaña
exports.categorizarCabana = async (req, res) => {
  try {
    const { categoria } = req.body;
    const cabana = await Cabana.findByIdAndUpdate(
      req.params.id,
      { categoria },
      { new: true }
    );
    if (!cabana) {
      return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    }
    res.json({ success: true, data: cabana });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};