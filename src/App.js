import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import GirasTecnicas from "./Components/GirasTecnicas/GirasTecnicas";
import { Fragment, useState } from "react";
import HeaderLogin from "./Components/common/HeaderLogin/HeaderLogin";
import FooterLogin from "./Components/common/FooterLogin/FooterLogin";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./Components/common/ProtectedRoute/ProtectedRoute";
import Header from "./Components/layouts/Header/Header";
import Menu from "./Components/layouts/Menu/Menu";
import GiraTecnicaData from "./Components/GiraTecnicaData/GiraTecnicaData";
import FormBuilder from "./Components/FormBuilder/FormBuilder";
import FormList from "./Components/FormList/FormList";

function App() {
  const { isAuthenticated, userRole, handleLogout, showNav, setShowNav } =
    useAuth();
  const [forms, setForms] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const addForm = (newForm) => {
    setForms([...forms, newForm]);
  };
  return (
    <BrowserRouter>
      <Routes>
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

        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" />
            ) : (
              <ProtectedRoute userRole={sessionStorage.getItem("userRole")} />
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
                <Header />
                <Menu
                  showNav={showNav}
                  handleLogout={handleLogout}
                  setShowNav={setShowNav}
                />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <main className="main-container">
                        <GirasTecnicas />
                      </main>
                    }
                  />
                  <Route
                    path="/gira-tecnica/:id"
                    element={
                      <main className="main-container">
                        <GiraTecnicaData />
                      </main>
                    }
                  />
                  <Route
                    path="/forms"
                    element={
                      <Fragment>
                        {isCreating ? (
                          <main className="main-container">
                            <FormBuilder
                            onSave={(form) => {
                              addForm(form);
                              setIsCreating(false);
                            }}
                          />
                          </main>
                        ) : (
                          <main className="main-container">
                            <FormList
                            forms={forms}
                            onCreate={() => setIsCreating(true)}
                          />
                          </main>
                        )}
                      </Fragment>
                    }
                  />
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
