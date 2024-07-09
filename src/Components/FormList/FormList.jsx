import React, { useEffect, useState } from 'react';
import './css/FormList.css';
import clienteAxios from '../../api/axios';
import { Link } from 'react-router-dom';
import PopupMessage from '../common/PopupMessage/PopupMessage';

const FormList = ({ onCreate }) => {
  const [forms, setForms] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await clienteAxios.get('/forms');
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  // Función para formatear la fecha en español
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };

  // Función para copiar el enlace al portapapeles
  const copyToClipboard = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setShowMessage(true); // Mostrar mensaje emergente
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Error al copiar el enlace al portapapeles');
    }
  };

  // Función para cerrar el mensaje emergente
  const closeMessage = () => {
    setShowMessage(false);
  };
  
  return (
    <div className="form-list-container">
      <div className="create-form-box">
        <button onClick={onCreate} className="create-form-button">Crear Nuevo Formulario</button>
      </div>
      <div className="forms-container">
        {forms.length === 0 ? (
          <p>No hay formularios disponibles. Crea un nuevo formulario para comenzar.</p>
        ) : (
          forms.map((form, index) => (
            <div key={index} className="form-item">
              <h3>{form.title}</h3>
              <p>{form.description}</p>
              <p>Fecha de Inicio: {formatDate(form.startDate)}</p>
              <p>Fecha de Fin: {formatDate(form.endDate)}</p>
              <Link to={`../form/${form.id}`} className="view-form-link">Ver Formulario</Link>
              <button
                className="copy-link-button"
                onClick={() => copyToClipboard(form.publicLink)}
              >
                Generar Link y Copiar
              </button>
            </div>
          ))
        )}
      </div>
      {showMessage && (
        <PopupMessage message="Enlace copiado al portapapeles" onClose={closeMessage} />
      )}
    </div>
  );
};

export default FormList;
