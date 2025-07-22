import { useState } from 'react';
import { ethers } from 'ethers';

const VotarModal = ({ eleccion, onClose, contrato, indiceEleccion }) => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Estilos
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxWidth: '500px',
    width: '100%',
    padding: '1.5rem',
    position: 'relative'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666',
    padding: '0.25rem'
  };

  const messageStyle = (type) => ({
    margin: '0 0 1rem 0',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    borderLeft: '4px solid',
    backgroundColor: type === 'error' ? '#ffebee' : type === 'success' ? '#e8f5e9' : '#e3f2fd',
    borderColor: type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3',
    color: type === 'error' ? '#b71c1c' : type === 'success' ? '#1b5e20' : '#0d47a1'
  });

  const optionLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    margin: '0.25rem 0',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: '1px solid #ddd',
    backgroundColor: '#fff'
  };

  const optionLabelHoverStyle = {
    ...optionLabelStyle,
    backgroundColor: '#f5f5f5'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
    marginLeft: '0.5rem',
    fontSize: '0.9rem'
  };

  const buttonPrimaryStyle = {
    ...buttonStyle,
    backgroundColor: '#4a6cf7',
    color: 'white',
    border: 'none'
  };

  const buttonDisabledStyle = {
    ...buttonPrimaryStyle,
    backgroundColor: '#b3b3b3',
    cursor: 'not-allowed'
  };

  const handleVotar = async () => {
    if (opcionSeleccionada === null) {
      setMensaje({ texto: 'Por favor selecciona una opción', tipo: 'error' });
      return;
    }

    try {
      setEnviando(true);
      setMensaje({ texto: 'Enviando voto a la blockchain...', tipo: 'info' });
      
      const tx = await contrato.votar(indiceEleccion, opcionSeleccionada);
      await tx.wait();
      
      setMensaje({ 
        texto: '¡Voto registrado exitosamente!', 
        tipo: 'success' 
      });
      
      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error al votar:', error);
      setMensaje({ 
        texto: 'Error al enviar el voto. Por favor intenta de nuevo.', 
        tipo: 'error' 
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button
          onClick={onClose}
          style={closeButtonStyle}
          disabled={enviando}
        >
          ✕
        </button>
        
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#333' }}>
          Votar en: {eleccion.nombre}
        </h2>
        
        {mensaje.texto && (
          <div style={messageStyle(mensaje.tipo)}>
            {mensaje.texto}
          </div>
        )}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.75rem 0', fontWeight: '500' }}>Selecciona una opción:</p>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {eleccion.propuestas.map((propuesta, index) => (
              <label 
                key={index} 
                style={opcionSeleccionada === index ? optionLabelHoverStyle : optionLabelStyle}
                onMouseOver={(e) => {
                  if (opcionSeleccionada !== index) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseOut={(e) => {
                  if (opcionSeleccionada !== index) {
                    e.currentTarget.style.backgroundColor = '#fff';
                  }
                }}
              >
                <input
                  type="radio"
                  name="opcionVoto"
                  style={{ marginRight: '0.75rem', width: '1.1rem', height: '1.1rem' }}
                  checked={opcionSeleccionada === index}
                  onChange={() => setOpcionSeleccionada(index)}
                  disabled={enviando}
                />
                <span>{propuesta}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={buttonStyle}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            onClick={handleVotar}
            disabled={enviando || opcionSeleccionada === null}
            style={enviando || opcionSeleccionada === null ? buttonDisabledStyle : buttonPrimaryStyle}
          >
            {enviando ? 'Enviando...' : 'Confirmar Voto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotarModal;
