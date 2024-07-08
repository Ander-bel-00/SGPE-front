import React from "react";
import "./css/HeaderLogin.css";
import LogoSena from "../../../assets/Logosimbolo-SENA-PRINCIPAL.png";
import LogoSGPE from "../../../assets/SGPE-fondo-azul-removebg-preview.png";

function HeaderLogin() {
  const headerStyle = {
    height: "4rem",
    padding: "4px",
    backgroundColor: "#04324c", // Suponiendo que este es el valor de --bg-azul-sena
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#fff"
  };

  const logoSGPEStyle = {
    position: "relative",
    right: "7%",
    width: "21rem"
  };

  const logoSenaStyle = {
    width: "7rem",
    height: "6.4rem"
  };

  return (
    <header className="header-login" style={headerStyle}>
      <img
        alt="Logo del sistema de gestión de proyectos y encuestas"
        src={LogoSGPE}
        className="header-login__logo-sgpe"
        style={logoSGPEStyle}
      />
      <img
        alt="Logo del sena"
        src={LogoSena}
        className="header-login__logo-sena"
        style={logoSenaStyle}
      />
    </header>
  );
}

export default HeaderLogin;
