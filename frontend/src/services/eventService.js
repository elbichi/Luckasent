const API_URL = "/api/eventos";

export const eventService = {
  getAllEvents: async () => {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al obtener eventos");
    return await res.json();
  },
  categorizarEvento: async (id, categoria) => {
    const res = await fetch(`${API_URL}/${id}/categorizar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ categoria })
    });
    return await res.json();
  }
};