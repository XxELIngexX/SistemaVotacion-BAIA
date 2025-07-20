import React, { useState, useEffect } from "react";

const AdminPage = ({ user, contrato, setUser }) => {
    const name = user?.name || "Administrador";
    const address = user?.wallet?.address || "Desconocido";

    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);

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
                <p>Conectado como: {address}</p>
            </div>

            <div className="admin-panel" style={{ display: "flex", gap: "2rem" }}>
                <div className="election-list" style={{ flex: 1 }}>
                    <h3>Lista de Elecciones</h3>
                    {elections.map((e) => (
                        <div key={e.id} className="election-item" style={{ marginBottom: "1rem" }}>
                            <strong>{e.name}</strong>

                            <p>Estado: {e.active ? "Activa" : "Inactiva"}</p>

                            <button onClick={() => e.active ? cerrarElecciones(e.id) : abrirElecciones(e.id)}>
                                {e.active ? "Desactivar" : "Activar"}
                            </button>
                            <button onClick={() => setSelectedElection(e)}>
                                Ver detalles
                            </button>
                        </div>
                    ))}
                </div>

                <div className="election-details" style={{ flex: 1 }}>
                    {selectedElection ? (
                        <>
                            <h3>Detalles de {selectedElection.name}</h3>
                            <p>ID: {selectedElection.id}</p>
                            <p>Estado actual: {selectedElection.active ? "Activa" : "Inactiva"}</p>
                            <button>Agregar Propuesta</button>
                            <button>Eliminar Propuesta</button>
                        </>
                    ) : (
                        <p>Selecciona una elección para ver detalles.</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default AdminPage;
