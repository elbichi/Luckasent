// Middleware para filtrar campos en inglés de los eventos
const filtrarCamposEvento = (req, res, next) => {
  // Lista de campos en inglés que deben ser filtrados
  const camposEnIngles = ['name', 'description', 'price', 'images', 'tags'];
  
  // Crear un nuevo objeto sin los campos en inglés
  const bodyFiltrado = { ...req.body };
  
  // Eliminar campos en inglés
  camposEnIngles.forEach(campo => {
    if (bodyFiltrado[campo]) {
      console.log(`[MIDDLEWARE] Filtrando campo en inglés: ${campo}`);
      delete bodyFiltrado[campo];
    }
  });
  
  // Actualizar el body de la petición
  req.body = bodyFiltrado;
  
  next();
};

module.exports = {
  filtrarCamposEvento
};
