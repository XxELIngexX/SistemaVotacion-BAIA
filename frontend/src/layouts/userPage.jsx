import React from "react";
import EleccionesActivas from "../components/user/EleccionesActivas";

const UserPage = ({ user, contrato, setUser }) => {
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Sistema de Votación</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: '500' }}>{user.name}</p>
              <p style={{ 
                margin: '2px 0 0 0', 
                fontSize: '0.75rem', 
                color: '#666',
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user.wallet.address}
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            Bienvenido, {user.name}
          </h2>
          <p style={{ margin: 0, color: '#555' }}>
            Aquí puedes ver las elecciones activas y emitir tu voto.
          </p>
        </div>

        {/* Lista de elecciones activas */}
        <EleccionesActivas contrato={contrato} userAddress={user.wallet.address} />
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'white',
        borderTop: '1px solid #eee',
        marginTop: '2rem',
        padding: '1rem 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
            Sistema de Votación - Todos los derechos reservados © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserPage;
