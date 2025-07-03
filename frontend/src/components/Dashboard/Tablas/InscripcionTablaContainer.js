import React, { useState, useEffect } from 'react';
import { inscripcionService } from '../../../services/inscripcionService';
import TablaInscripciones from './InscripcionTabla';

const InscripcionTabla = ({ userRole, readOnly, canCreate, canEdit, canDelete, filtroUsuario }) => {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener información del usuario actual
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    cargarInscripciones();
  }, [filtroUsuario]);

  const cargarInscripciones = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      // Si filtroUsuario es true, usar el endpoint específico para mis inscripciones
      if (filtroUsuario) {
        response = await inscripcionService.getMisInscripciones();
      } else {
        response = await inscripcionService.getAllInscripciones();
      }
      
      if (response.success) {
        setInscripciones(response.data);
        console.log('Inscripciones cargadas:', response.data.length);
      } else {
        setError(response.message || 'Error al cargar inscripciones');
      }
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (inscripcion) => {
    // Lógica para editar inscripción
    console.log('Editar inscripción:', inscripcion);
  };

  const handleEliminar = async (inscripcionId) => {
    if (window.confirm('¿Está seguro de eliminar esta inscripción?')) {
      try {
        const response = await inscripcionService.deleteInscripcion(inscripcionId);
        if (response.success) {
          cargarInscripciones(); // Recargar las inscripciones
        } else {
          alert('Error al eliminar la inscripción');
        }
      } catch (error) {
        console.error('Error al eliminar inscripción:', error);
        alert('Error al eliminar la inscripción');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Cargando inscripciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={cargarInscripciones} className="btn-retry">
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="inscripcion-tabla-container">
      {filtroUsuario && (
        <div className="info-header">
          <h3>📝 Mis Inscripciones</h3>
          <p>Aquí puedes ver todas las inscripciones que has realizado a los eventos.</p>
        </div>
      )}
      
      {inscripciones.length === 0 ? (
        <div className="no-inscripciones">
          <div className="no-data-message">
            <h4>No hay inscripciones</h4>
            <p>
              {filtroUsuario 
                ? 'Aún no te has inscrito a ningún evento. ¡Explora los eventos disponibles!' 
                : 'No hay inscripciones registradas en el sistema.'}
            </p>
          </div>
        </div>
      ) : (
        <TablaInscripciones 
          inscripciones={inscripciones}
          onEditar={canEdit ? handleEditar : null}
          onEliminar={canDelete ? handleEliminar : null}
        />
      )}
    </div>
  );
};

export default InscripcionTabla;
