import React, { useState } from 'react';
import "../styles/form.css";

export default function Form({ setMostrarModal, crearEleccion }) {
  const [nombreEleccion, setNombreEleccion] = useState('');
  const [propuestas, setPropuestas] = useState(['']);

  const handlePropuestaChange = (index, value) => {
    const nuevas = [...propuestas];
    nuevas[index] = value;

    // Si el usuario llenó el último input, agregamos uno nuevo
    if (index === propuestas.length - 1 && value.trim() !== '') {
      nuevas.push('');
    }

    // Si el penúltimo y último están vacíos, quitamos el último
    if (
      nuevas.length >= 2 &&
      nuevas[nuevas.length - 1].trim() === '' &&
      nuevas[nuevas.length - 2].trim() === ''
    ) {
      nuevas.pop();
    }

    setPropuestas(nuevas);
  };

  const handleSubmit = () => {
    const propuestasFiltradas = propuestas.filter(p => p.trim() !== '');
    console.log("Nombre:", nombreEleccion);
    console.log("Propuestas:", propuestasFiltradas);
    crearEleccion(nombreEleccion, propuestasFiltradas);
    setMostrarModal(false);
  };

  const handleCancel = () => {
    setMostrarModal(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Crear Nueva Elección</h3>
        <h4>Nombre de la elección</h4>
        <input
          type="text"
          placeholder="Nombre de la elección"
          value={nombreEleccion}
          onChange={e => setNombreEleccion(e.target.value)}
        />

        <h4>Propuestas</h4>
        {propuestas.map((p, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Propuesta ${i + 1}`}
            value={p}
            onChange={e => handlePropuestaChange(i, e.target.value)}
          />
        ))}

        <div className="form-buttons">
          <button className="cancel-btn" onClick={handleCancel}>Cancelar</button>
          <button className="submit-btn" onClick={handleSubmit}>Crear</button>
        </div>
      </div>
    </div>
  );
}
