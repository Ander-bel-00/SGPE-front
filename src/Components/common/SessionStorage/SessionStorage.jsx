import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SessionManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionExpiring, setSessionExpiring] = useState(false);

  // Simula el tiempo de sesión (4 horas en milisegundos)
  const SESSION_TIMEOUT = 4 * 60 * 60 * 1000;

  useEffect(() => {
    let sessionTimer;

    const checkSession = () => {
      const token = sessionStorage.getItem('token');
      if (!token && location.pathname !== '/login') {
        // Si no hay token almacenado y no es la página de inicio de sesión, redirige a la página de inicio de sesión
        navigate('/login');
      } else if (token) {
        const tokenExpiration = new Date(JSON.parse(atob(token.split('.')[1])).exp * 1000);
        const now = new Date();

        // Calcula el tiempo restante para la expiración del token
        const timeRemaining = tokenExpiration - now;

        if (timeRemaining < SESSION_TIMEOUT) {
          setSessionExpiring(true);
        } else {
          setSessionExpiring(false);
        }

        // Setea el temporizador para mostrar la notificación de expiración de sesión
        sessionTimer = setTimeout(() => {
          setSessionExpiring(true);
        }, timeRemaining - SESSION_TIMEOUT);
      }
    };

    checkSession();

    // Limpia el temporizador cuando el componente se desmonta
    return () => clearTimeout(sessionTimer);
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    // Limpiar el token y cualquier otra información de sesión almacenada localmente
    localStorage.removeItem('token');
    // Redirige a la página de inicio de sesión
    navigate('/login');
  };

  const handleContinueSession = () => {
    setSessionExpiring(false);
  };

  return (
    <div>
      {sessionExpiring && (
        <div className="session-expiring-modal">
          <p>Su sesión está a punto de expirar debido a la inactividad.</p>
          <button onClick={handleContinueSession}>Continuar sesión</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
};

export default SessionManager;
