// src/components/UserPage.jsx
import React from "react";

const UserPage = ({ user }) => {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Bienvenido, Usuario {user?.nombre || "Desconocido"}</h2>
      <p>Conectado como: {user?.address}</p>
    </div>
  );
};
// votar
// ver las elecciones disponibles
export default UserPage;
