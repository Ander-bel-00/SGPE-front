import React, { useEffect, useState } from "react";
import "./css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const { handleLogin } = useAuth();

  // Estado para mostrar spinner si se está cargando los datos.
  const [loading, setLoading] = useState(false); 

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

  // Función para manejar el envío de datos del formulario de Login.
  const onSubmit = async (e) => {
    // Previene el efecto por defecto del evento así evita que se envíe el formulario antes de tener todos los datos.
    e.preventDefault();

    setLoading(true); // Activar el estado de carga

    // Aquí irá el código para enviar los datos del estado formData a la función handleLogin.
    try {
      // Se envían los datos del formulario del Login (Se usa await para dar una espera mientras se obtienen los datos).
      await handleLogin(navigate, formData);
    } catch (error) {
      // Catch en caso de error se hace una acción.

      // Mostrar en consola el error.
      console.log(error);
      // Si se encuentra un array de errores guardar lo que contie ese array.
      if (Array.isArray(error.response.data)) {
        // Guardar en el estado de errores todo lo que contenga el array error.
        setErrors(error.response.data);
      } else {
        // Si no es un array solo almacenar el mensaje que se recibe del error.
        setErrors([error.response.data.message]);
      }
    } finally {
      setLoading(false); // Desactivar el estado de carga
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
          {loading ? <span className="system__spinner"></span> : "Iniciar sesión"}
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
