import { ethers } from "ethers";
import { useState } from "react";
import "../css/login.css";

export default function Login({ onLogin }) {
  const [userName, setUserName] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    if (!window.ethereum) {
      alert("Instala MetaMask");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      onLogin({
        name: userName || "Usuario",
        wallet: { provider, signer, address }
      });
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-image">
        <img src="/vote.png" alt="Logo de votaciones" />
      </div>

      <div className="login-form-container">
        <h1 className="login-header">Bienvenido al Sistema de Votaciones</h1>
        <form onSubmit={handleLogin} className="login-form">
          <h2 className="login-title">Iniciar sesión</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <button type="submit">Conectar con MetaMask</button>
        </form>
      </div>
    </div>
  );
}
