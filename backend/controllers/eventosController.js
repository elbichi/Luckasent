const Events = require('../models/Eventos');

// Obtener todos los eventos
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Events.find({ active: true }).populate('category');
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener eventos', error: error.message });
    }
};

// Obtener evento por ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Events.findById(req.params.id).populate('category');
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
        const { name, description, price, category, images } = req.body;
        const event = new Events({ name, description, price, category, images });
        const savedEvent = await event.save();
        res.status(201).json({ success: true, data: savedEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear evento', error: error.message });
    }
};

// Actualizar evento
exports.updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Events.findByIdAndUpdate(
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
        const deletedEvent = await Events.findByIdAndDelete(req.params.id);
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
        const event = await Events.findByIdAndUpdate(
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