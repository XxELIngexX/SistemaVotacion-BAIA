import VotacionesApp from "./VotacionesApp";
import { useState } from "react";
import Login from "./components/Login.jsx";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
      <h1>Bienvenido, {user.name} 👋</h1>
      <p>Conectado como: {user.wallet.address}</p>
      <VotacionesApp signer={user.wallet.signer} />
    </div>
  );
}

export default App;
