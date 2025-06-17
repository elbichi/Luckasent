const Cabanas = require('../models/Cabanas');

// Obtener todas las cabañas activas
exports.getAllCabanas = async (req, res) => {
    try {
        const cabanas = await Cabanas.find({ active: true });
        res.status(200).json({ success: true, data: cabanas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener cabañas', error: error.message });
    }
};

// Obtener cabaña por ID
exports.getCabanaById = async (req, res) => {
    try {
        const cabana = await Cabanas.findById(req.params.id);
        if (!cabana) {
            return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
        }
        res.status(200).json({ success: true, data: cabana });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener cabaña', error: error.message });
    }
};

// Crear nueva cabaña
exports.createCabana = async (req, res) => {
    try {
        const { name, description, price, capacity, location, images } = req.body;
        const cabana = new Cabanas({ name, description, price, capacity, location, images });
        const savedCabana = await cabana.save();
        res.status(201).json({ success: true, data: savedCabana });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear cabaña', error: error.message });
    }
};

// Actualizar cabaña
exports.updateCabana = async (req, res) => {
    try {
        const updatedCabana = await Cabanas.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedCabana) {
            return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
        }
        res.status(200).json({ success: true, data: updatedCabana });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar cabaña', error: error.message });
    }
};

// Eliminar cabaña (borrado físico)
exports.deleteCabana = async (req, res) => {
    try {
        const deletedCabana = await Cabanas.findByIdAndDelete(req.params.id);
        if (!deletedCabana) {
            return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
        }
        res.status(200).json({ success: true, message: 'Cabaña eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar cabaña', error: error.message });
    }
};

// Deshabilitar cabaña (soft delete)
exports.disableCabana = async (req, res) => {
    try {
        const cabana = await Cabanas.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        );
        if (!cabana) {
            return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
        }
        res.status(200).json({ success: true, message: 'Cabaña deshabilitada', data: cabana });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al deshabilitar cabaña', error: error.message });
    }
};