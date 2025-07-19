import { useEffect, useState } from "react";
import { ethers } from "ethers";
import votacionesAbi from "../../artifacts/contracts/voting.sol/SistemaVotacion.json";

const contratoAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function VotacionesApp() {
  const [cuenta, setCuenta] = useState(null);
  const [contrato, setContrato] = useState(null);
  const [propuestas, setPropuestas] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
  async function conectarContrato() {
    try {
      if (!window.ethereum) {
        alert("Por favor instala MetaMask");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" }); // 🔥 fuerza conexión

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const instanciaContrato = new ethers.Contract(
        contratoAddress,
        votacionesAbi.abi,
        signer
      );

      setContrato(instanciaContrato);

      const cuentaActual = await signer.getAddress();
      setCuenta(cuentaActual);

      const total = await instanciaContrato.getCantidadPropuestas();
      console.log("Cantidad de propuestas:", total.toString());

      const propuestasTemp = [];

      for (let i = 0; i < total; i++) {
        const propuesta = await instanciaContrato.propuestas(i);
        propuestasTemp.push({
          nombre: propuesta.nombre,
          votos: propuesta.numeroVotos.toString()
        });
      }

      setPropuestas(propuestasTemp);
    } catch (err) {
      console.error("Error conectando contrato:", err);
      setError("No se pudo conectar con el contrato.");
    }
  }

  conectarContrato();
}, []);


       

  return (
    <div>
      <h1>Sistema de Votaciones</h1>

      {cuenta ? (
        <p>Conectado como: {cuenta}</p>
      ) : (
        <button
          onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}
        >
          Conectar MetaMask
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Propuestas disponibles:</h2>
      <ul>
        {propuestas.map((p, index) => (
          <li key={index}>
            <strong>{p.nombre}</strong> - Votos: {p.votos}
          </li>
        ))}
      </ul>
    </div>
  );
}