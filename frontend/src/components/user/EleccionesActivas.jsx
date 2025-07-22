import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotarModal from './VotarModal';

const EleccionesActivas = ({ contrato, userAddress }) => {
  const [elecciones, setElecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eleccionSeleccionada, setEleccionSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [yaVoto, setYaVoto] = useState({});

  useEffect(() => {
    const cargarElecciones = async () => {
      try {
        const totalElecciones = await contrato.obtenerNumeroElecciones();
        const eleccionesActivas = [];
        const votosUsuario = {};

        for (let i = 0; i < totalElecciones; i++) {
          const eliminada = await contrato.estaEliminada(i);
          if (eliminada) continue;

          const abierta = await contrato.estaAbierta(i);
          if (!abierta) continue;

          const nombre = await contrato.obtenerNombreEleccion(i);
          const numPropuestas = await contrato.obtenerNumeroPropuestas(i);
          const propuestas = await contrato.obtenerNombresPropuestas(i);
          
          // Verificar si el usuario ya votó
          const voto = await contrato.yaVoto(i);
          votosUsuario[i] = voto;

          eleccionesActivas.push({
            id: i,
            nombre,
            numPropuestas,
            propuestas,
            abierta
          });
        }

        setElecciones(eleccionesActivas);
        setYaVoto(votosUsuario);
      } catch (error) {
        console.error('Error al cargar elecciones:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contrato) {
      cargarElecciones();
    }
  }, [contrato, modalAbierto]);

  const handleVotarClick = (eleccion) => {
    setEleccionSeleccionada(eleccion);
    setModalAbierto(true);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '1rem' }}>Cargando elecciones activas...</div>;
  }

  if (elecciones.length === 0) {
    return <div style={{ textAlign: 'center', padding: '1rem' }}>No hay elecciones activas en este momento.</div>;
  }

  // Estilos
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem'
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const titleStyle = {
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333'
  };

  const buttonStyle = {
    backgroundColor: '#4a6cf7',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
    fontSize: '0.9rem'
  };

  const votedBadgeStyle = {
    display: 'inline-block',
    backgroundColor: '#e6f7e6',
    color: '#2e7d32',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    marginTop: '1rem'
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>Elecciones Activas</h2>
      
      <div style={containerStyle}>
        {elecciones.map((eleccion) => (
          <div key={eleccion.id} style={cardStyle}>
            <h3 style={titleStyle}>{eleccion.nombre}</h3>
            <p style={{ margin: '0.5rem 0', color: '#555' }}>
              {eleccion.numPropuestas} opción{eleccion.numPropuestas !== 1 ? 'es' : ''} disponible{eleccion.numPropuestas !== 1 ? 's' : ''}
            </p>
            
            <div>
              {yaVoto[eleccion.id] ? (
                <span style={votedBadgeStyle}>
                  Ya votaste en esta elección
                </span>
              ) : (
                <button
                  onClick={() => handleVotarClick(eleccion)}
                  style={buttonStyle}
                >
                  Votar Ahora
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalAbierto && eleccionSeleccionada && (
        <VotarModal
          eleccion={eleccionSeleccionada}
          onClose={() => setModalAbierto(false)}
          contrato={contrato}
          indiceEleccion={eleccionSeleccionada.id}
        />
      )}
    </div>
  );
};

export default EleccionesActivas;
