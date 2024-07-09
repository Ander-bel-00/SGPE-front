import React, { useEffect, useState } from "react";
import "./css/GiraTecnicaData.css";
import { useParams } from "react-router-dom";
import clienteAxios from "../../api/axios";

function GiraTecnicaData() {
  const { id } = useParams();
  const [giraTecnica, setGiraTecnica] = useState(null);
  const [centroFormacionNombre, setCentroFormacionNombre] = useState("");
  const [fuenteFinanciacionNombre, setFuenteFinanciacionNombre] = useState("");

  useEffect(() => {
    const obtenerGira = async () => {
      try {
        const res = await clienteAxios.get(`/gira_tecnica/${id}`);
        setGiraTecnica(res.data.giraTecnica);

        const resCentroFormacion = await clienteAxios.get(
          `/centro_formacion/${res.data.giraTecnica.centro_formacion_id}`
        );
        setCentroFormacionNombre(resCentroFormacion.data.centroFormacionExists.nombre);

        const resFuenteFinanciacion = await clienteAxios.get(
          `/fuente_financiacion/${res.data.giraTecnica.fuente_financiacion_id}`
        );
        setFuenteFinanciacionNombre(resFuenteFinanciacion.data.fuente.nombre);
      } catch (error) {
        console.error("Error fetching gira técnica:", error);
      }
    };

    obtenerGira();
  }, [id]);

  return (
    <div className="main-container__content-children">
      <div className="gira-tecnica-box">
        {giraTecnica && (
          <div className="gira-tecnica-card">
            <h2 className="gira-tecnica-title">Información de la Gira Técnica</h2>
            <div className="gira-tecnica-details">
              <p>
                <strong>ID:</strong> {giraTecnica.id}
              </p>
              <p>
                <strong>Centro de Formación:</strong>{" "}
                {centroFormacionNombre}
              </p>
              <p>
                <strong>Fuente de Financiación:</strong>{" "}
                {fuenteFinanciacionNombre}
              </p>
              <p>
                <strong>Objetivo General:</strong> {giraTecnica.objetivo_general}
              </p>
              <p>
                <strong>Resultado Esperado:</strong>{" "}
                {giraTecnica.resultado_esperado}
              </p>
              <p>
                <strong>Valor Total:</strong> {giraTecnica.valor_total}
              </p>
              <p>
                <strong>Fecha de Creación:</strong>{" "}
                {new Date(giraTecnica.createdAt).toLocaleDateString("es-ES")}
              </p>
              <p>
                <strong>Última Actualización:</strong>{" "}
                {new Date(giraTecnica.updatedAt).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GiraTecnicaData;
