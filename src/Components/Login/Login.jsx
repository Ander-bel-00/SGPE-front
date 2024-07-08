import React, { useEffect, useState } from "react";
import "./css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const { handleLogin } = useAuth();

  const [formData, setFormData] = useState({
    tipo_documento: "",
    numero_documento: "",
    contrasena: "",
  });

  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const { tipo_documento, numero_documento, contrasena } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "numero_documento" && !/^\d*$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(navigate, formData);
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      } else {
        setErrors([error.response.data.message]);
      }
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <div className="login-content">
      <div className="login-content__login-form-box">
        <form
          className="login-content__login-form-box__form"
          onSubmit={onSubmit}
        >
          <label>Tipo de documento</label>
          <select
            name="tipo_documento"
            value={tipo_documento}
            onChange={onChange}
          >
            <option value="" disabled>
              Seleccione su documento
            </option>
            <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
            <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
            <option value="Cédula de Extranjería">Cédula de Extranjería</option>
            <option value="PEP">PEP</option>
            <option value="Permiso por Protección Temporal">Permiso por Protección Temporal</option>
          </select>
          <label>Número de documento</label>
          <input
            type="text"
            placeholder="Ingresa el documento"
            name="numero_documento"
            value={numero_documento}
            onChange={onChange}
          />
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa la contraseña"
            name="contrasena"
            value={contrasena}
            onChange={onChange}
          />
          <div className="login-content__login-form-box__form__footer">
            <Link
              to=""
              className="login-content__login-form-box__form__footer__link"
            >
              Olvidé mi contraseña
            </Link>
          </div>
          <button className="login-content__login-form-box__form__footer__botton">
            Iniciar sesión
          </button>
          {errors.map((error, i) => (
            <div
              key={i}
              className="login-content__login-form-box__form__errors"
            >
              {error}
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}

export default Login;
