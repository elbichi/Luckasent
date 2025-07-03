const API_URL = "http://localhost:3000/api/solicitudes";

export const solicitudService = {
  // Método para obtener todas las solicitudes
  getAllSolicitudes: async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Error al obtener solicitudes");
      return await res.json();
    } catch (error) {
      console.error('Error en getAllSolicitudes:', error);
      throw error;
    }
  },

  // Método para obtener solicitudes del usuario actual
  getMisSolicitudes: async () => {
    try {
      const res = await fetch(`${API_URL}/mis-solicitudes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Error al obtener mis solicitudes");
      return await res.json();
    } catch (error) {
      console.error('Error en getMisSolicitudes:', error);
      throw error;
    }
  },

  // Mantener compatibilidad con nombres anteriores
  getAll: async () => {
    return await solicitudService.getAllSolicitudes();
  },
  create: async (solicitud) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(solicitud)
    });
    return await res.json();
  },
  update: async (id, solicitud) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(solicitud)
    });
    return await res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return await res.json();
  },

  // Método para eliminar solicitud (alias)
  deleteSolicitud: async (id) => {
    return await solicitudService.delete(id);
  },
};