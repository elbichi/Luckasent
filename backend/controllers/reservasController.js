const Reserva = require('../models/Reservas');
const Solicitud = require('../models/Solicitud');
const Usuario = require('../models/User');
const { body } = require('express-validator');

// Crear reserva
exports.crearReserva = async (req, res) => {
  try {
    const { usuario, cabana, fechaInicio, fechaFin, observaciones } = req.body;

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(usuario)) {
      return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
    }
    if (!mongoose.Types.ObjectId.isValid(cabana)) {
      return res.status(400).json({ success: false, message: 'ID de cabaña inválido' });
    }

    // Validar existencia
    const usuarioExiste = await Usuario.findById(usuario);
    if (!usuarioExiste) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    const cabanaExiste = await Cabana.findById(cabana);
    if (!cabanaExiste) {
      return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    }

    // Crear reserva
    const reserva = new Reserva({
      usuario,
      cabana,
      fechaInicio,
      fechaFin,
      observaciones
    });
    await reserva.save();

    // Crear solicitud asociada (opcional)
    const solicitud = new Solicitud({
      solicitante: usuarioExiste._id,
      responsable: usuarioExiste._id,
      email: usuarioExiste.email,
      telefono: usuarioExiste.phone,
      tipoSolicitud: 'Hospedaje',
      categoria: cabanaExiste.categoria, // Guarda la categoría de la cabaña
      descripcion: `Reserva de cabaña ${cabanaExiste.nombre}`,
      estado: 'Nueva',
      prioridad: 'Media',
      referencia: reserva._id
    });
    await solicitud.save();

    // Enlazar la solicitud a la reserva
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