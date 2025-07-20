import { useEffect, useState } from "react"; 
import { ethers } from "ethers";
import votacionesAbi from "../../artifacts/contracts/voting.sol/SistemaVotacion.json";

const contratoAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function VotacionesApp({ signer }) {
  const [contrato, setContrato] = useState(null);
  const [propuestas, setPropuestas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function conectarContrato() {
      try {
        const instanciaContrato = new ethers.Contract(
          contratoAddress,
          votacionesAbi.abi,
          signer
        );

        setContrato(instanciaContrato);

        const total = await instanciaContrato.getCantidadPropuestas();
        const propuestasTemp = [];

        for (let i = 0; i < total; i++) {
          const propuesta = await instanciaContrato.propuestas(i);
          propuestasTemp.push({
            nombre: propuesta.nombre,
            votos: propuesta.numeroVotos.toString()
          });
        }

          // 👇 Aquí comparas la address del signer con la del admin
      const adminAddress = await instanciaContrato.admin();
      const signerAddress = await signer.getAddress();
      const esAdmin = signerAddress.toLowerCase() === adminAddress.toLowerCase();

      if (esAdmin) {
        console.log("Eres el admin");
        // Aquí puedes mostrar botones especiales o lo que necesites
      } else {
        console.log("Eres un usuario normal");
      }


        setPropuestas(propuestasTemp);
      } catch (err) {
        console.error("Error conectando contrato:", err);
        setError("No se pudo conectar con el contrato.");
      }
    }

    conectarContrato();
  }, [signer]);

  return (
    <div>
      <h2>Propuestas disponibles:</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
