import React, { useState } from 'react';
import './Dashboard.css';

const NavegacionSeminarista = ({ activeTab, onTabChange, onModificarPerfil }) => {
  const tabs = [
    {
      id: 'eventos',
      name: 'Eventos',
      icon: '📅',
      description: 'Ver eventos disponibles e inscribirse'
    },
    {
      id: 'cabanas',
      name: 'Cabañas',
      icon: '🏠',
      description: 'Ver cabañas disponibles y hacer reservas'
    },
    {
      id: 'mis-inscripciones',
      name: 'Mis Inscripciones',
      icon: '📝',
      description: 'Ver mis inscripciones a eventos'
    },
    {
      id: 'mis-reservas',
      name: 'Mis Reservas',
      icon: '🗓️',
      description: 'Ver mis reservas de cabañas'
    },
    {
      id: 'mis-solicitudes',
      name: 'Mis Solicitudes',
      icon: '📋',
      description: 'Ver el estado de mis solicitudes'
    },
    {
      id: 'crear-solicitud',
      name: 'Nueva Solicitud',
      icon: '➕',
      description: 'Crear una nueva solicitud'
    }
  ];

  return (
    <div className="navegacion-seminarista">
      <div className="nav-header">
        <h2>🎓 Panel Seminarista</h2>
        <p>Bienvenido al panel de seminarista. Aquí puedes ver eventos, cabañas y gestionar tus solicitudes.</p>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">📊</span>
            <span className="stat-label">Dashboard Personalizado</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">🔒</span>
            <span className="stat-label">Acceso Seguro</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">⚡</span>
            <span className="stat-label">Navegación Rápida</span>
          </div>
        </div>
      </div>
      
      <div className="nav-grid">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`nav-card ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="nav-icon">{tab.icon}</div>
            <div className="nav-content">
              <h3>{tab.name}</h3>
              <p>{tab.description}</p>
            </div>
            <div className="nav-arrow">→</div>
          </div>
        ))}
      </div>

      {/* Sección de información rápida */}
      <div className="info-section">
        <h3>ℹ️ Información Importante</h3>
        <div className="info-cards">
          <div className="info-card">
            <strong>📌 Recordatorio:</strong>
            <p>Como seminarista puedes crear inscripciones, reservas y solicitudes, pero no puedes modificar o eliminar las existentes.</p>
          </div>
          <div className="info-card">
            <strong>🕐 Horarios:</strong>
            <p>Las solicitudes son revisadas de lunes a viernes. Permite 24-48 horas para respuesta.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavegacionSeminarista;
