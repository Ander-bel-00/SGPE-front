import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import GirasTecnicas from "./Components/GirasTecnicas/GirasTecnicas";
import { Fragment } from "react";
import HeaderLogin from "./Components/common/HeaderLogin/HeaderLogin";
import FooterLogin from "./Components/common/FooterLogin/FooterLogin";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./Components/common/ProtectedRoute/ProtectedRoute";

function App() {
  const { isAuthenticated, userRole, handleLogout, showNav, setShowNav } =
    useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userRole}`} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userRole}`} />
            ) : (
              <Fragment>
                <HeaderLogin />
                <main className="main-login-box">
                  <Login />
                  <FooterLogin />
                </main>
              </Fragment>
            )
          }
        />

        {/* Rutas Protegidas que solo accede el usuario con rol de administrador */}
        <Route
          path="/Admin/*"
          element={
            <ProtectedRoute
              isAllowed={
                !!sessionStorage.getItem("isAuthenticated") &&
                sessionStorage.getItem("userRole") === "Admin"
              }
              redirectTo="/login"
            >
              <Fragment>
                <Routes>
                <Route path="/" element={<GirasTecnicas />} />
                </Routes>
              </Fragment>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
