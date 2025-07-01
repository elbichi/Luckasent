const mongoose = require('mongoose');
const Inscripcion = require('../models/Inscripciones');
const Solicitud = require('../models/Solicitud');
const Evento = require('../models/Eventos');
const Usuario = require('../models/User');
const Categorizacion = require('../models/categorizacion');
// Crear inscripción
exports.crearInscripcion = async (req, res) => {
  try {
    const { usuario, evento, categoria } = req.body;

    // 1. Validar que los IDs sean ObjectId válidos
    if (!mongoose.Types.ObjectId.isValid(usuario)) {
      return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
    }
    if (!mongoose.Types.ObjectId.isValid(evento)) {
      return res.status(400).json({ success: false, message: 'ID de evento inválido' });
    }
    if (!mongoose.Types.ObjectId.isValid(categoria)) {
      return res.status(400).json({ success: false, message: 'ID de categoría inválido' });
    }

    // 2. Validar que existan en la base de datos
    const usuarioExiste = await Usuario.findById(usuario);
    if (!usuarioExiste) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    const eventoExiste = await Evento.findById(evento);
    if (!eventoExiste) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    const categoriaExiste = await Categorizacion.findById(categoria);
    if (!categoriaExiste) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    // 1. Crear la inscripción
    const inscripcion = new Inscripcion(req.body);
    await inscripcion.save();

    // Buscar datos del usuario para la solicitud
    const user = await Usuario.findById(req.body.usuario); // Asegúrate de importar el modelo Usuario

    // 2. Crear la solicitud asociada
    const solicitud = new Solicitud({
      solicitante: user._id,
      responsable: user._id, // O el responsable que corresponda
      correo: user.correo,
      telefono: user.telefono,
      tipoSolicitud: 'Inscripción',
      categoria: req.body.categoria,
      descripcion: `Inscripción al evento ${req.body.evento}`,
      estado: 'Nueva',      // Valor válido según tu enum
      prioridad: 'Media',   // Valor válido según tu enum
      referencia: inscripcion._id
    });
    await solicitud.save();

    // 3. Enlazar la solicitud a la inscripción
    inscripcion.solicitud = solicitud._id;
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
      .populate('evento', 'nombre fecha')
      .populate('categoria', 'nombre descripcion codigo'); // <--- Agrega esto
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
      .populate('evento', 'nombre fecha')
      .populate('categoria', 'nombre descripcion codigo'); // <--- Agrega esto
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