import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilosDashboard.css';

const CabanasNavegables = ({ onReservar }) => {
  const [cabanas, setCabanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);

  useEffect(() => {
    cargarCabanas();
  }, []);

  const cargarCabanas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/cabanas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCabanas(response.data.data);
      }
    } catch (error) {
      setError('Error al cargar cabañas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    // Removemos emojis para un diseño más limpio
    return '';
  };

  if (loading) return <div className="loading-cabanas">Cargando cabañas...</div>;
  if (error) return <div className="error-cabanas">{error}</div>;

  return (
    <div className="app-background">
      <div className="section-container">
        <h2 style={{fontWeight:800, fontSize:'2rem', color:'#a5b4fc'}}>Cabañas Disponibles</h2>
        <div className="grid-cards">
          {cabanas.map(cabana => (
            <div key={cabana._id} className="card">
              <div className="cabana-imagen" style={{width:'100%',textAlign:'center',marginBottom:'1rem'}}>
                <img 
                  src={cabana.imagen || '/images/default-cabin.svg'} 
                  alt={cabana.nombre}
                  style={{width:'90px',height:'90px',objectFit:'cover',borderRadius:'50%',background:'#23243a'}}
                  onError={(e) => {e.target.src = '/images/default-cabin.svg';}}
                />
              </div>
              <div className="card-title">{cabana.nombre}</div>
              <div className="card-subtitle">{cabana.descripcion || 'Sin descripción'}</div>
              <span style={{color:'#fbbf24',fontWeight:600}}>Precio: {cabana.precio ? `$${cabana.precio}` : '-'}</span>
              <span>Estado: <b style={{color:cabana.estado==='disponible'?'#5eead4':'#f472b6'}}>{cabana.estado}</b></span>
              <span>Cupos: {cabana.cuposDisponibles ?? '-'} / {cabana.cuposTotales ?? '-'}</span>
              <span>Ubicación: {cabana.ubicacion}</span>
              <span style={{color:'#818cf8'}}>Etiquetas: {cabana.etiquetas?.join(', ')}</span>
              <button className="card-btn" onClick={()=>onReservar && onReservar(cabana)} disabled={cabana.estado!=='disponible'}>
                Reservar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CabanasNavegables;
