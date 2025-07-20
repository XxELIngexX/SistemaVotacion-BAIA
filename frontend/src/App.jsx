import VotacionesApp from "./VotacionesApp";
import Login from "./layouts/Login.jsx";
import AdminPage from "./layouts/adminPage.jsx";
import UserPage from "./layouts/userPage.jsx";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import votacionesAbi from "../../artifacts/contracts/voting.sol/SistemaVotacion.json";

const contratoAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [user, setUser] = useState(null);
  const [contrato, setContrato] = useState(null);
  // const [error, setError] = useState(null);
  // const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function conectarContrato() {
      try {
        if (!user) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const instanciaContrato = new ethers.Contract(
          contratoAddress,
          votacionesAbi.abi,
          signer
        );

        setContrato(instanciaContrato);

        const adminAddress = await instanciaContrato.admin();
        const signerAddress = await signer.getAddress();
        const esAdmin = signerAddress.toLowerCase() === adminAddress.toLowerCase();

        // Actualizamos el objeto `user` incluyendo `isAdmin`
        setUser(prev => ({
          ...prev,
          isAdmin: esAdmin
        }));

      } catch (err) {
        console.error("Error conectando contrato:", err);
        // setError("No se pudo conectar con el contrato.");
      }
    }

    conectarContrato();
  }, [user]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <>
      {user.isAdmin ? (
        <AdminPage
          user={user}
          contrato={contrato}
          setUser={setUser}

        />
      ) : (
        <UserPage
          user={user}
          contrato={contrato}
          setUser={setUser}
        />
      )}
    </>
  );
}

export default App;
