import React, { useEffect, useState } from "react";
import "./css/GirasTecnicas.css";
import clienteAxios from "../../api/axios";
import { useNavigate } from "react-router-dom";

function GirasTecnicas() {
  const [usuario, setUsuario] = useState(null);
  const [GirasTecnicas, setGirasTecnicas] = useState([]);
  const [centrosFormacionData, setCentrosFormacionData] = useState([]);
  const [regionalData, setRegionalData] = useState([]);
  const [fuenteFinanciacionData, setFuenteFinanciacionData] = useState([]);
  // Estado para mostrar spinner si se está cargando los datos.
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true); // Activar el estado de carga
    const obtenerGiras = async () => {
      try {
        const resUser = await clienteAxios.get("/usuario");
        setUsuario(resUser.data.usuario);

        const resGiras = await clienteAxios.get(`/giras_tecnicas`);

        if (Array.isArray(resGiras.data.girasTecnicas)) {
          setGirasTecnicas(resGiras.data.girasTecnicas);

          const promesasCentrosFormacion = resGiras.data.girasTecnicas.map(async (gira) => {
            const resCentroFormacion = await clienteAxios.get(
              `/centro_formacion/${gira.centro_formacion_id}`
            );
            return resCentroFormacion.data.centroFormacionExists;
          });

          // Esperando a que todas las solicitudes de centro de formación se completen.
          const centrosFormacionData = await Promise.all(promesasCentrosFormacion);
          setCentrosFormacionData(centrosFormacionData); // Guardar los datos en el estado

          // Obtener datos de la regional para cada centro de formación
          const promesasRegional = centrosFormacionData.map(async (centro) => {
            const resRegional = await clienteAxios.get(
              `/regional/${centro.regional_id}`
            );
            return resRegional.data.regional;
          });

          // Esperando a que todas las solicitudes de regional se completen.
          const regionalData = await Promise.all(promesasRegional);
          setRegionalData(regionalData); // Guardar los datos en el estado

          // Obtener datos de fuente de financiación para cada gira técnica
          const promesasFuenteFinanciacion = resGiras.data.girasTecnicas.map(async (gira) => {
            const resFuenteFinanciacion = await clienteAxios.get(
              `/fuente_financiacion/${gira.fuente_financiacion_id}`
            );
            return resFuenteFinanciacion.data.fuente;
          });

          // Esperando a que todas las solicitudes de fuente de financiación se completen.
          const fuenteFinanciacionData = await Promise.all(promesasFuenteFinanciacion);
          setFuenteFinanciacionData(fuenteFinanciacionData); // Guardar los datos en el estado
        } else {
          console.error("Los datos de giras técnicas no son un array:", resGiras.data);
        }
      } catch (error) {
        console.error(
          "Hubo un error al obtener las giras técnicas de la base de datos",
          error
        );
      } finally {
        setLoading(false); // Desactivar el estado de carga
      }
    };

    // Función para obtener giras técnicas cada 1 (1000 ms)
    const interval = setInterval(obtenerGiras, 1000);

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  const handleClickGira = (giraID) => {
    navigate(`../gira-tecnica/${giraID}`);
  };

  return (
    <div className="main-container__content-children">
      <h2 className="GirasTecnicas-title">Giras técnicas</h2>
      {loading ? (
        <span className="system__spinner"></span>
      ) : (
        <table className="GirasTecnicas-table">
          <thead className="GirasTecnicas-table__thead">
            <tr className="GirasTecnicas-table__tr">
              <th className="GirasTecnicas-table__th">Regional</th>
              <th className="GirasTecnicas-table__th">Centro de formación</th>
              <th className="GirasTecnicas-table__th">Fuente de financiación</th>
              <th className="GirasTecnicas-table__th">Objetivo general</th>
            </tr>
          </thead>
          <tbody className="GirasTecnicas-table__tbody">
            {GirasTecnicas.map((gira, index) => (
              <tr
                className="GirasTecnicas-table__tr"
                key={gira.id}
                onClick={() => handleClickGira(gira.id)}
              >
                <td className="GirasTecnicas-table__td">
                  {regionalData[index] ? regionalData[index].nombre : ""}
                </td>
                <td className="GirasTecnicas-table__td">
                  {centrosFormacionData[index]
                    ? centrosFormacionData[index].nombre
                    : ""}
                </td>
                <td className="GirasTecnicas-table__td">
                  {fuenteFinanciacionData[index]
                    ? fuenteFinanciacionData[index].nombre
                    : ""}
                </td>
                <td className="GirasTecnicas-table__td">
                  {gira.objetivo_general}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GirasTecnicas;
