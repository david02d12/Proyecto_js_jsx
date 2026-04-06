import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import Login from './components/Login';
import Home from './components/Home';
import Listar from './components/Listar';

const API_URL = 'http://localhost:3000/productos';

function App() {
  const [view, setView] = useState('login'); 
  const [productos, setProductos] = useState([]);
  const [auth, setAuth] = useState({ email: '', pass: '' });
  const [userLabel, setUserLabel] = useState('Administrador');

  const fetchProductos = async (nombre = '') => {
    try {
      const url = nombre ? `${API_URL}?nombre=${nombre}` : API_URL;
      const res = await axios.get(url);
      setProductos(res.data);
      if (view !== 'listar') setView('listar');
    } catch (err) {
      console.error("Error:", err);
      alert("Error al conectar con el servidor de productos");
    }
  };

  const handleLogin = () => {
    if (auth.email && auth.pass) {
      setUserLabel(auth.email.split('@')[0]);
      setView('home');
    } else {
      alert("Por favor, ingrese credenciales válidas");
    }
  };

  if (view === 'login') {
    return <Login auth={auth} setAuth={setAuth} handleLogin={handleLogin} />;
  }

  return (
    <div className="dashboard-layout">
      <header className="main-header">
        <div className="logo-section">
          <h2>Celuaccel</h2>
        </div>
        <div className="user-section">
          <span>Hola, {userLabel}</span>
          <button className="logout-btn" onClick={() => setView('login')}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <nav>
            <ul>
              <li className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>
                Panel Principal
              </li>
              <li className={view === 'listar' ? 'active' : ''} onClick={() => fetchProductos()}>
                Catálogo de Productos
              </li>
              <li onClick={() => alert("Próximamente: Gestión de Servicios")}>
                Estado del servicio
              </li>
              <li onClick={() => alert("Próximamente: Historial")}>
                Historial
              </li>
            </ul>
          </nav>
        </aside>

        <main className="content-area">
          <div className="view-card">
            {view === 'home' && (
              <Home setView={setView} fetchProductos={fetchProductos} />
            )}
            
            {view === 'listar' && (
              <Listar 
                productos={productos} 
                setView={setView} 
                onRefresh={fetchProductos} 
              />
            )}
          </div>
        </main>
      </div>

      <footer className="footer-slim">
        &copy; 2026 CeluAccel System | Base de datos: celuaccel
      </footer>
    </div>
  );
}

export default App;