import React, { useEffect, useState } from 'react';
import Dashboard from '../Dashboard';
import { useNavigate } from 'react-router-dom';

/**
 * Componente Dashboard específico para el rol de Admin
 * Utiliza el Dashboard base con todas las funcionalidades
 */
const DashboardAdmin = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const usuarioStorage = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuarioStorage || !token) {
      navigate('/login');
      return;
    }

    try {
      const usuarioData = JSON.parse(usuarioStorage);
      
      // Verificar si el usuario tiene el rol correcto
      if (usuarioData.tipoUsuario !== 'admin') {
        navigate('/login');
        return;
      }

      setUsuario(usuarioData);
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      navigate('/login');
    }
  }, [navigate]);

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <Dashboard 
      usuario={usuario} 
      rol="admin" 
      titulo="Panel de Administración"
      descripcion="Gestiona usuarios, eventos, cabañas y configuraciones del sistema"
    />
  );
};

export default DashboardAdmin;
