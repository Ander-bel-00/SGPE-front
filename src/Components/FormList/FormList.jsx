import React from 'react';
import './css/FormList.css';

const FormList = ({ forms, onCreate }) => {
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
              <p>Fecha de Inicio: {form.startDate}</p>
              <p>Fecha de Fin: {form.endDate}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FormList;
