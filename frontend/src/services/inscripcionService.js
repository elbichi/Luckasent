const API_URL = "http://localhost:3000/api/inscripciones";

export const inscripcionService = {
  // Método para obtener todas las inscripciones
  getAllInscripciones: async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener inscripciones");
      return await res.json();
    } catch (error) {
      console.error('Error en getAllInscripciones:', error);
      throw error;
    }
  },

  // Método para obtener inscripciones del usuario actual
  getMisInscripciones: async () => {
    try {
      const res = await fetch(`${API_URL}/mis-inscripciones`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener mis inscripciones");
      return await res.json();
    } catch (error) {
      console.error('Error en getMisInscripciones:', error);
      throw error;
    }
  },

  // Mantener compatibilidad con nombres anteriores
  getAll: async () => {
    return await inscripcionService.getAllInscripciones();
  },

  create: async (inscripcion) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(inscripcion),
    });
    if (!res.ok) throw new Error("Error al crear inscripción");
    return await res.json();
  },

  update: async (id, inscripcion) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(inscripcion),
    });
    if (!res.ok) throw new Error("Error al actualizar inscripción");
    return await res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar inscripción");
    return await res.json();
  },

  // Método para eliminar inscripción (alias)
  deleteInscripcion: async (id) => {
    return await inscripcionService.delete(id);
  },
};