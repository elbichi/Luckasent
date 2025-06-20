const Evento = require('../models/Eventos');
const Categorizacion = require('../models/categorizacion');

// Obtener todos los eventos
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Evento.find({ active: true }).populate('categoria');
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener eventos', error: error.message });
    }
};

// Obtener evento por ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Evento.findById(req.params.id).populate('categoria');
        if (!event) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener evento', error: error.message });
    }
};

// Crear nuevo evento
exports.createEvent = async (req, res) => {
    try {
        const { name, description, price, categoria, images } = req.body;
        const event = new Evento({ name, description, price, categoria, images });
        const savedEvent = await event.save();
        res.status(201).json({ success: true, data: savedEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear evento', error: error.message });
    }
};

// Actualizar evento
exports.updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Evento.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedEvent) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        res.status(200).json({ success: true, data: updatedEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar evento', error: error.message });
    }
};

// Eliminar evento
exports.deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Evento.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Evento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar evento', error: error.message });
    }
};

// Deshabilitar evento (solo admin)
exports.disableEvent = async (req, res) => {
    try {
        const event = await Evento.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Evento deshabilitado', data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al deshabilitar evento', error: error.message });
    }
};

// Categorizar evento
exports.categorizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoria, subCategoria, etiquetas } = req.body;

    // Validación de datos
    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: 'La categoría es requerida'
      });
    }

    // Actualizar evento con la categorización
    const eventoActualizado = await Evento.findByIdAndUpdate(
      id,
      {
        categoria,
        subCategoria,
        etiquetas,
        categorizadoPor: req.userId,
        fechaCategorizacion: new Date()
      },
      { new: true }
    );

    if (!eventoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Evento categorizado exitosamente',
      data: eventoActualizado
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al categorizar el evento',
      error: error.message
    });
  }
};

// Obtener eventos por categoría
exports.getEventosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.query;
    
    const filtro = categoria ? { categoria } : {};
    
    const eventos = await Evento.find(filtro)
      .populate('categorizadoPor', 'username email')
      .sort({ fechaCategorizacion: -1 });

    res.status(200).json({
      success: true,
      data: eventos
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos por categoría',
      error: error.message
    });
  }
};