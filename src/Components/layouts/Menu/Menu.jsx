import React, { Fragment, useEffect, useRef, useState } from "react";
import "./css/Menu.css";
import clienteAxios from "../../../api/axios";
import { Link } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { BiSolidLogOut } from "react-icons/bi";
import { SiGoogleforms } from "react-icons/si";

function Menu({ showNav, handleLogout, setShowNav }) {
  const [usuario, setUsuario] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await clienteAxios.get("/usuario");
        setUsuario(response.data.usuario);
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };

    obtenerUsuario();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowNav(false);
      }
    };

    if (showNav) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNav]);

  const handleCloseMenu = () => {
    setShowNav(false);
  };

  const handleHover = (option, position) => {
    setHoveredOption(option);
    const topPosition = position.top + 22;
    // Ajusta las coordenadas left y top para el texto del hover
    setHoveredPosition({
      top: topPosition,
      left: position.left + position.width + 70, // Suma la posición de desplazamiento del menú
    });
  };

  const handleHoverEnd = () => {
    setHoveredOption(null);
  };

  return (
    <Fragment>
      <>
        {window.innerWidth >= 1024 ? (
          <div ref={menuRef} className="sidenav">
            <button className="sidenav__close-btn" onClick={handleCloseMenu}>
              X
            </button>
            <ul className="">
              <MenuItem
                title="Inicio"
                icon={<IoHomeSharp className="" />}
                link="/"
                handleHover={handleHover}
                handleHoverEnd={handleHoverEnd}
              />
              <MenuItem
                title="Formularios"
                icon={<SiGoogleforms className="" />}
                link="/Admin/forms"
                handleHover={handleHover}
                handleHoverEnd={handleHoverEnd}
              />
              <MenuItem
                title="Cerrar Sesión"
                icon={<BiSolidLogOut className="" />}
                handleHover={handleHover}
                handleHoverEnd={handleHoverEnd}
                handleLogout={handleLogout}
              />
            </ul>

            {hoveredOption && (
              <div
                className="sidenav__hovered-options"
                style={{
                  top: hoveredPosition.top,
                  left: hoveredPosition.left,
                }}
              >
                <div className="sidenav__hovered-text">{hoveredOption}</div>
              </div>
            )}
          </div>
        ) : (
          <div ref={menuRef} className={showNav ? "sidenav active" : "sidenav"}>
            <button className="" onClick={handleCloseMenu}>
              X
            </button>
            <h3 className="">¡Bienvenido {usuario.nombres}!</h3>
            <ul className="">
              <li className="" onClick={handleCloseMenu}>
                <Link to={"/"}>
                  <IoHomeSharp className="" /> Inicio
                </Link>
              </li>
            </ul>
          </div>
        )}
      </>
    </Fragment>
  );
}

const MenuItem = ({
  title,
  icon,
  link,
  handleHover,
  handleHoverEnd,
  handleLogout,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(title.toLowerCase());
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({ top: rect.top, left: rect.right });
      }
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [title]);

  return (
    <li
      id={title.toLowerCase()}
      className="menu-options"
      onMouseEnter={() => handleHover(title, position)}
      onMouseLeave={handleHoverEnd}
      onClick={handleLogout}
    >
      <Link to={link}>
        <div className="menu-option-wrapper">{icon}</div>
      </Link>
    </li>
  );
};

export default Menu;
