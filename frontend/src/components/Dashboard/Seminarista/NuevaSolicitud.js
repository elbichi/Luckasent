import React, { useState } from 'react';
import { useAuthCheck } from '../../../hooks/useAuthCheck';
import { solicitudService } from '../../../services/solicirudService';
import './NuevaSolicitud.css';

const NuevaSolicitud = () => {
  const { user } = useAuthCheck('seminarista');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const form = e.target;
    const data = {
      solicitante: user?._id,
      correo: form.correo.value,
      telefono: form.telefono.value,
      tipoSolicitud: form.tipoSolicitud.value,
      modeloReferencia: form.modeloReferencia.value || undefined,
      referencia: form.referencia.value || undefined,
      categoria: form.categoria.value || undefined,
      descripcion: form.descripcion.value,
      prioridad: form.prioridad.value,
      observaciones: form.observaciones.value
    };
    try {
      await solicitudService.create(data);
      setMsg('¡Solicitud enviada exitosamente!');
      form.reset();
    } catch (err) {
      setMsg('Error al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seccion-nueva-solicitud">
      <h2>Nueva Solicitud</h2>
      <form onSubmit={handleSubmit} className="form-nueva-solicitud">
        <input type="hidden" name="solicitante" value={user?._id || ''} />
        <label>Correo:</label>
        <input type="email" name="correo" defaultValue={user?.email || ''} required />
        <label>Teléfono:</label>
        <input type="tel" name="telefono" defaultValue={user?.telefono || ''} required />
        <label>Tipo de solicitud:</label>
        <select name="tipoSolicitud" required defaultValue="">
          <option value="">Selecciona...</option>
          <option value="Inscripción">Inscripción</option>
          <option value="Hospedaje">Hospedaje</option>
          <option value="Alimentación">Alimentación</option>
          <option value="Transporte">Transporte</option>
          <option value="Certificados">Certificados</option>
          <option value="Administrativa">Administrativa</option>
          <option value="Otra">Otra</option>
        </select>
        <label>Modelo de referencia (opcional):</label>
        <select name="modeloReferencia" defaultValue="">
          <option value="">Ninguno</option>
          <option value="Eventos">Evento</option>
          <option value="Cabana">Cabaña</option>
          <option value="Inscripcion">Inscripción</option>
          <option value="Reserva">Reserva</option>
        </select>
        <label>ID de referencia (opcional):</label>
        <input type="text" name="referencia" placeholder="ID relacionado (si aplica)" />
        <label>Categoría (opcional):</label>
        <input type="text" name="categoria" placeholder="ID de categoría" />
        <label>Descripción:</label>
        <textarea name="descripcion" required placeholder="Describe tu solicitud" />
        <label>Prioridad:</label>
        <select name="prioridad" defaultValue="Media">
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
        <label>Observaciones (opcional):</label>
        <textarea name="observaciones" placeholder="Observaciones adicionales" />
        <button type="submit" className="solicitud-btn" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
        {msg && <div style={{marginTop:'1rem', color:'#5eead4', fontWeight:600}}>{msg}</div>}
      </form>
    </div>
  );
};

export default NuevaSolicitud;
