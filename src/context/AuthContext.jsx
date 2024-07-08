import React, { createContext, useState, useContext, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import clienteAxios from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvide");
  return context;
};



export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const isAuthenticatedSesionStorage = sessionStorage.getItem("isAuthenticated");
    const userRoleSesionStorage = sessionStorage.getItem("userRole");
    if (
      isAuthenticatedSesionStorage &&
      userRoleSesionStorage
    ) {
      setIsAuthenticated(true);
      setUserRole(userRoleSesionStorage);
    }
  }, []);

  const handleLogin = async (navigate, formData) => {
    try {
      const res = await clienteAxios.post("/auth/login", formData);
      setIsAuthenticated(true);
      setUserRole(res.data.usuario.rol);
      const token = res.data.token;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("isAuthenticated", true);
      sessionStorage.setItem("userRole", res.data.usuario.rol);
      navigate(`/${res.data.usuario.rol}`);
    } catch (error) {
      console.error("Error al inciar Sesión: ", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await clienteAxios.post('/auth/logout');
      // Limpiar todos los datos de sessionStorage
      sessionStorage.clear();
      setIsAuthenticated(false);
      setUserRole(null);
      setShowNav(false);
      return <Navigate to="/login" />;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        handleLogin,
        handleLogout,
        showNav,
        setShowNav
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
