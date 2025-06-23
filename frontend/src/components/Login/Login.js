import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Login.css'; // Crearemos este archivo después

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      navigate('/admin/users');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };
  return (
    <div className="login-container">
        <div className="container">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
        <div className="logo">
          <span className="luckas">Luckas</span><span className="ent">ent</span>
        </div>
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <p>Erro al Ingresar</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese su correo electrónico"
                required
              />
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
              />
       
            <button type="submit" className="btn-primary_1">
              Ingresar
            </button>
            <button type="button" className="btn-google" onClick={() => window.location.href='/auth/google'}>
              <img src="/img/Google.png" alt="Google logo" className="google-logo mr-2" />
              Iniciar sesión con Google
            </button>
          </form>
          <a href="/forgot-password" className="forgot-password">¿Olvidaste tu contraseña?</a>
        </div>
        <a href="/register" className="register-link">
          No tienes cuenta? <span>Regístrate</span>
        </a>
    </div>
      <footer>&copy; 2024 LuckasEnt</footer>
    </div>
  );
};

export default Login;