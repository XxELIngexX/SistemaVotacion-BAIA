import React, { useState, useEffect } from "react";
import "../styles/adminPage.css";
import EleccionCard from "../components/EleccionCard";
import Form from "../components/Form";

const AdminPage = ({ user, contrato, setUser }) => {
    const name = user?.name || "Administrador";
    const address = user?.wallet?.address || "Desconocido";

    const [elections, setElections] = useState([]);
    const [eleccionSeleccionada, setEleccionSeleccionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);




    consultarElecciones();

    async function consultarElecciones() {
        try {
            const electionList = await contrato.obtenerElecciones();

            const parsedElections = electionList.map((e, index) => ({
                id: index,
                name: e[0],
                active: e[1],
                proposals: e[2],
                votes: e[3],
            }));

            setElections(parsedElections);
        } catch (error) {
            console.error("Error al consultar elecciones:", error);
        }
    }

    async function abrirElecciones(indice) {
        try {
            const tx = await contrato.abrirEleccion(indice);
            await tx.wait(); // Esperar a que se mine la transacción
            console.log(`Elección ${indice} abierta correctamente.`);
            // Aquí puedes volver a cargar las elecciones si deseas actualizar la vista
        } catch (error) {
            console.error(`Error al abrir la elección ${indice}:`, error);
        }
    }

    async function cerrarElecciones(indice) {
        try {
            const tx = await contrato.cerrarEleccion(indice);
            await tx.wait(); // Esperar a que se mine la transacción
            console.log(`Elección ${indice} abierta correctamente.`);
            // Aquí puedes volver a cargar las elecciones si deseas actualizar la vista
        } catch (error) {
            console.error(`Error al abrir la elección ${indice}:`, error);
        }
    }

    async function crearEleccion(_nombreEleccion,_propuestas) {
        try {
            const tx = await contrato.crearEleccion(_nombreEleccion, _propuestas);
            await tx.wait(); // Esperar a que se mine la transacción
            console.log("Elección creada correctamente.");
            setMostrarModal(false);
            consultarElecciones(); // Recargar las elecciones después de crear una nueva
        } catch (error) {
            console.error("Error al crear la elección:", error);
        }
    }

    





    useEffect(() => {
        //conectar con contrato y obtener las elecciones
        if (!contrato) return;

        const fetchElections = async () => {
            try {
                //abrirElecciones(1);

            } catch (error) {
                console.error("Error al obtener elecciones:", error);
            }
        };
        fetchElections();
    }, [contrato]);


    return (
        <div className="admin-home">
            <div className="admin-header">
                <h2>Bienvenido, Administrador {name}</h2>
            </div>

            <p style={{ textAlign: "center", width: "100%" }}>
                Conectado como: {address}
            </p>


            <div className="admin-panel" style={{ display: "flex", gap: "2rem" }}>
                <div className="election-list" style={{ flex: 1 }}>
                    <h3>Lista de Elecciones</h3>
                    {elections.map((e) => (
                        <EleccionCard
                            key={e.id}
                            eleccion={e}
                            onAbrir={abrirElecciones}
                            onCerrar={cerrarElecciones}
                        />
                    ))}
                </div>
            </div>

            <div className="crear-eleccion">
                <button onClick={() => setMostrarModal(true)} className="crear-btn">
                    Crear nueva elección
                </button>
            </div>


            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Crear Nueva Elección</h3>
                        <Form 
                            setMostrarModal={setMostrarModal} 
                            crearEleccion={crearEleccion}
                        />
                        
                    </div>
                </div>
            )}

        </div>

    );
};

export default AdminPage;
