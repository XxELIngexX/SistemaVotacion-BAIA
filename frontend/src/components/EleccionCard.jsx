import React, { useState } from "react";
import "../styles/eleccionCard.css";
import DetallesCard from "../components/DetailsCard";

const EleccionCard = ({ eleccion, onAbrir, onCerrar }) => {
    const { id, name, active } = eleccion;
    const [mostrarDetalles, setMostrarDetalles] = useState(false);

    const toggleDetalles = () => {
        setMostrarDetalles(!mostrarDetalles);
    };

    return (
        <div className="eleccion-card">
            <h3 className="eleccion-titulo">{name}</h3>
            <p className="eleccion-estado">
                Estado:{" "}
                <span className={active ? "estado-activa" : "estado-inactiva"}>
                    {active ? "Activa" : "Inactiva"}
                </span>
            </p>

            <div className="eleccion-botones">
                <button
                    className="boton-accion"
                    onClick={() => (active ? onCerrar(id) : onAbrir(id))}
                >
                    {active ? "Desactivar" : "Activar"}
                </button>

                <button
                    className="boton-detalles"
                    onClick={toggleDetalles}
                >
                    {mostrarDetalles ? "Ocultar Detalles" : "Ver Detalles"}
                </button>
            </div>

            {
                mostrarDetalles && (
                    <DetallesCard eleccion={eleccion} />
                )
            }
        </div>
    );
};

export default EleccionCard;
