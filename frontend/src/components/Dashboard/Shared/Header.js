import React, { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import Breadcrumb from './Breadcrumb';
import QuickActions from './QuickActions';

const Header = ({ user, breadcrumbPath, onTabChange }) => {
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  // Efecto para cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuUsuarioAbierto && !event.target.closest('.usuario-container')) {
        setMenuUsuarioAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuUsuarioAbierto]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleModificarPerfil = () => {
    // Emit event to parent component
    const event = new CustomEvent('modificar-perfil');
    window.dispatchEvent(event);
    setMenuUsuarioAbierto(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-section">
            <h1 className="dashboard-title">
              <span className="titulo-gradiente">Luckasent</span>
              <span className="badge-seminarista">Seminarista</span>
            </h1>
          </div>
          <Breadcrumb path={breadcrumbPath} />
        </div>
        
        <div className="header-right">
          <QuickActions onTabChange={onTabChange} />
          <UserMenu 
            user={user}
            isOpen={menuUsuarioAbierto}
            onToggle={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
            onLogout={handleLogout}
            onModificarPerfil={handleModificarPerfil}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
