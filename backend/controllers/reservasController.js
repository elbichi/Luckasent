const Reserva = require('../models/Reservas');
const Solicitud = require('../models/Solicitud');
const Usuario = require('../models/User');

// Crear reserva
exports.crearReserva = async (req, res) => {
  try {
    const reserva = new Reserva(req.body);
    await reserva.save();

    // Buscar datos del usuario para la solicitud
    const user = await Usuario.findById(req.body.usuario);

    const solicitud = new Solicitud({
      solicitante: user._id,
      responsable: user._id, // O el responsable que corresponda
      email: user.email,
      telefono: user.phone,
      tipoSolicitud: 'Hospedaje',
      categoria: req.body.categoria,
      descripcion: `Reserva de cabaña ${req.body.recurso}`,
      estado: 'Nueva',      // Valor válido según tu enum
      prioridad: 'Media',   // Valor válido según tu enum
      referencia: reserva._id
    });
    await solicitud.save();

    reserva.solicitud = solicitud._id;
    await reserva.save();

    res.status(201).json({ success: true, data: reserva });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Obtener todas las reservas
exports.obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find()
      .populate('usuario', 'username email')
      .populate('categoria', 'nombre descripcion codigo'); // <-- aquí
    res.json({ success: true, data: reservas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener reserva por ID
exports.obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id)
      .populate('usuario', 'username email')
      .populate('categoria', 'nombre descripcion codigo'); // <-- aquí
    if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    res.json({ success: true, data: reserva });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar reserva
exports.actualizarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    res.json({ success: true, data: reserva });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Eliminar reserva
exports.eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndDelete(req.params.id);
    if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    res.json({ success: true, message: 'Reserva eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};