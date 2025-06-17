const Tarea = require('../models/Tarea');

// Crear tarea
exports.crearTarea = async (req, res) => {
    try {
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.status(201).json(tarea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todas las tareas
exports.obtenerTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find().populate('asignadoA');
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener tarea por ID
exports.obtenerTareaPorId = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id).populate('asignadoA');
        if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json(tarea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar tarea
exports.actualizarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json(tarea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findByIdAndDelete(req.params.id);
        if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};