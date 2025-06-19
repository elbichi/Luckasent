// controllers/categoriaSolicitudController.js
const CategoriaSolicitud = require('../models/categorizacion');
const Solicitud = require('../models/Solicitud');

// CREAR nueva categoría
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, codigo, precio, lugar } = req.body; // Añadir precio aquí
    
    // Verificar si el código ya existe
    const categoriaExistente = await CategoriaSolicitud.findOne({ codigo });
    if (categoriaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese código'
      });
    }

    const nuevaCategoria = new CategoriaSolicitud({
      nombre,
      descripcion,
      codigo,
      precio,  // Añadir precio aquí
      lugar,
      creadoPor: req.userId
    });

    await nuevaCategoria.save();

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: nuevaCategoria
    });

  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la categoría',
      error: error.message
    });
  }
};

// OBTENER todas las categorías
const obtenerCategorias = async (req, res) => {
  try {
    const { activo } = req.query;
    
    let filtro = {};
    if (activo !== undefined) {
      filtro.activo = activo === 'true';
    }

    const categorias = await CategoriaSolicitud.find(filtro)
      .populate('creadoPor', 'nombre email')
      .sort({ prioridad: 1, nombre: 1 });

    res.json({
      success: true,
      data: categorias,
      total: categorias.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías',
      error: error.message
    });
  }
};

// OBTENER categoría por ID
const obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await CategoriaSolicitud.findById(req.params.id)
      .populate('creadoPor', 'nombre email');

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: categoria
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la categoría',
      error: error.message
    });
  }
};

// ACTUALIZAR categoría
const actualizarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, codigo, color, prioridad, activo } = req.body;

    // Si se está cambiando el código, verificar que no exista
    if (codigo) {
      const categoriaExistente = await CategoriaSolicitud.findOne({
        codigo,
        _id: { $ne: req.params.id }
      });
      
      if (categoriaExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese código'
        });
      }
    }

    const categoriaActualizada = await CategoriaSolicitud.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, codigo, color, prioridad, activo },
      { new: true, runValidators: true }
    );

    if (!categoriaActualizada) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: categoriaActualizada
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la categoría',
      error: error.message
    });
  }
};

// ELIMINAR categoría
const eliminarCategoria = async (req, res) => {
  try {
    // Verificar si hay solicitudes usando esta categoría
    const solicitudesConCategoria = await Solicitud.countDocuments({
      'categoria.id': req.params.id
    });

    if (solicitudesConCategoria > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${solicitudesConCategoria} solicitudes asociadas`
      });
    }

    const categoriaEliminada = await CategoriaSolicitud.findByIdAndDelete(req.params.id);

    if (!categoriaEliminada) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la categoría',
      error: error.message
    });
  }
};
// CATEGORIZAR una solicitud
const categorizarSolicitud = async (req, res) => {
  try {
    const { categoriaId } = req.body;
    const solicitudId = req.params.id;

    // Verificar que la categoría existe
    const categoria = await CategoriaSolicitud.findById(categoriaId);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Verificar que la solicitud existe
    const solicitud = await Solicitud.findById(solicitudId);
    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Actualizar la solicitud con la categoría
    const solicitudActualizada = await Solicitud.findByIdAndUpdate(
      solicitudId,
      {
        categoria: {
          id: categoria._id,
          nombre: categoria.nombre,
          codigo: categoria.codigo
        },
        estado: 'categorizada',
        fechaCategorizacion: new Date(),
        categorizadoPor: req.usuario.id
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Solicitud categorizada exitosamente',
      data: solicitudActualizada
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al categorizar la solicitud',
      error: error.message
    });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
  categorizarSolicitud
};