import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import clienteAxios from "../../api/axios";
import Swal from "sweetalert2";
import "./css/FormView.css";

const FormView = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await clienteAxios.get(`/form/${id}`);
        setForm(response.data);
        // Inicializar responses con respuestas vacías para cada pregunta si form.Questions está definido
        if (response.data.Questions && response.data.Questions.length > 0) {
          const initialResponses = response.data.Questions.map((q) => ({
            questionId: q.id,
            answer: "",
          }));
          setResponses(initialResponses);
        } else {
          setResponses([]); // Si no hay preguntas, inicializa responses como un array vacío
        }
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    };

    fetchForm();
  }, [id]);

  console.log(form);

  const handleAnswerChange = (index, value) => {
    const newResponses = [...responses];
    if (newResponses[index]) {
      newResponses[index].answer = value;
    }
    setResponses(newResponses);
  };

  const submitResponses = async () => {
    try {
      await clienteAxios.post("/form/submit", { formId: id, responses });
      Swal.fire({
        title: "Respuestas enviadas con éxito",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error submitting responses:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al enviar las respuestas",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Verificar si form es null antes de intentar acceder a form.Questions
  if (!form) return <p>Cargando formulario...</p>;

  return (
    <div className="form-view-container">
      <h1>{form.title}</h1>
      <p>{form.description}</p>
      {form.Questions &&
        form.Questions.length > 0 &&
        form.Questions.map((question, index) => (
          <div key={question.id} className="question-response">
            <p>{question.content}</p>
            {question.type === "short-answer" && (
              <input
                type="text"
                value={responses[index]?.answer || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Respuesta"
              />
            )}
            {question.type === "long-answer" && (
              <textarea
                value={responses[index]?.answer || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            )}
            {/* Agregar manejo para otros tipos de preguntas aquí */}
          </div>
        ))}
      <div className="btn-send-box">
        <button onClick={submitResponses}>Enviar Respuestas</button>
      </div>
    </div>
  );
};

export default FormView;
