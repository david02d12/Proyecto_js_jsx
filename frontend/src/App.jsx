import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Servicios from './components/Servicios';
import Chat from './components/Chat';
import Notificaciones from './components/Notificaciones';
import Catalogo from './components/Catalogo';

const API = 'http://localhost:3000';

function App() {
  const [logueado, setLogueado] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [userData, setUserData] = useState(null); 
  const [tabActivo, setTabActivo] = useState('servicios');
  const [notifCount, setNotifCount] = useState(0);

  const [formReg, setFormReg] = useState({
    ID_Usuario: '', Codigo_Documento: '1', Nombre: '', Fecha_Nacimiento: '',
    Direccion: '', Telefono: '', Correo: '', Contraseña: ''
  });

  const token = () => localStorage.getItem('token');
  const cfg = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('userData');
    if (t && u) {
      const parsed = JSON.parse(u);
      setUserData(parsed);
      setLogueado(true);
      setTabActivo('servicios');
    }
  }, []);

  useEffect(() => {
    if (!logueado || !userData) return;
    const fetchNotif = async () => {
      try {
        const endpoint = userData.rol === 3
          ? `${API}/api/notificaciones/admin`
          : userData.rol === 1
            ? `${API}/api/notificaciones/tecnico`
            : `${API}/api/notificaciones/usuario/${userData.id}`;
        const res = await axios.get(endpoint, cfg());
        const sinLeer = res.data.filter(n => !n.leido).length;
        setNotifCount(sinLeer);
      } catch (e) { }
    };
    fetchNotif();
    const intervalo = setInterval(fetchNotif, 20000);
    return () => clearInterval(intervalo);
  }, [logueado, userData]);

  const acceder = async () => {
    const u = loginUser.trim();
    const p = loginPass.trim();
    if (!u || !p) return alert('Por favor completa los campos.');
    try {
      const res = await axios.post(`${API}/api/login`, { user: u, password: p });
      if (res.data.auth) {
        const ud = { id: res.data.user, nombre: res.data.nombre, rol: res.data.rol };
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userData', JSON.stringify(ud));
        setUserData(ud);
        setLogueado(true);
        setTabActivo('servicios');
      }
    } catch (e) { alert('Usuario o contraseña incorrectos.'); }
  };

  const registrarUsuario = async () => {
    if (!formReg.ID_Usuario || !formReg.Nombre || !formReg.Correo || !formReg.Contraseña)
      return alert('Completa los campos obligatorios.');
    try {
      await axios.post(`${API}/api/registro`, formReg);
      alert('Registro exitoso. Ya puedes iniciar sesión.');
      setModoRegistro(false);
    } catch (e) { alert('Error al registrar. Verifica que el documento no esté en uso.'); }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    setLogueado(false);
    setUserData(null);
    setTabActivo('servicios');
    setNotifCount(0);
  };

  const getTabs = (rol) => {
    const base = [
      { key: 'servicios', label: 'Servicios', id: 'tab-servicios' },
      { key: 'chat', label: 'Chat', id: 'tab-chat' },
    ];
    if (rol !== 1) {
      base.push({ key: 'catalogo', label: 'Catálogo', id: 'tab-catalogo' });
    }
    if (rol === 1) {
      base.push({ key: 'catalogo', label: 'Inventario', id: 'tab-catalogo' });
    }
    base.push({ key: 'notificaciones', label: `${rol === 3 ? 'Administracion' : 'Alertas'}`, id: 'tab-notificaciones', badge: notifCount });
    return base;
  };

  if (modoRegistro) {
    const tiposDoc = [
      { id: '1', nombre: 'Cédula' }, { id: '2', nombre: 'Tarjeta de Identidad' },
      { id: '3', nombre: 'Cédula de Extranjería' }, { id: '4', nombre: 'Pasaporte' }, { id: '5', nombre: 'PEP' },
    ];
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-logo">
            <h1 className="auth-brand">CELUACCEL</h1>
            <p className="auth-sub">Crear cuenta nueva</p>
          </div>
          <div className="reg-grid">
            <div className="campo">
              <label>Número de documento *</label>
              <input value={formReg.ID_Usuario} onChange={e => setFormReg({...formReg, ID_Usuario: e.target.value})} placeholder="Ej: 1234567890" />
            </div>
            <div className="campo">
              <label>Tipo de documento *</label>
              <select value={formReg.Codigo_Documento} onChange={e => setFormReg({...formReg, Codigo_Documento: e.target.value})}>
                {tiposDoc.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
            <div className="campo full">
              <label>Nombre completo *</label>
              <input value={formReg.Nombre} onChange={e => setFormReg({...formReg, Nombre: e.target.value})} placeholder="Tu nombre completo" />
            </div>
            <div className="campo">
              <label>Fecha de nacimiento</label>
              <input type="date" value={formReg.Fecha_Nacimiento} onChange={e => setFormReg({...formReg, Fecha_Nacimiento: e.target.value})} />
            </div>
            <div className="campo">
              <label>Teléfono</label>
              <input value={formReg.Telefono} onChange={e => setFormReg({...formReg, Telefono: e.target.value})} placeholder="300 123 4567" />
            </div>
            <div className="campo full">
              <label>Dirección</label>
              <input value={formReg.Direccion} onChange={e => setFormReg({...formReg, Direccion: e.target.value})} placeholder="Ej: Calle 10 #20-30" />
            </div>
            <div className="campo full">
              <label>Correo electrónico *</label>
              <input type="email" value={formReg.Correo} onChange={e => setFormReg({...formReg, Correo: e.target.value})} placeholder="tu@correo.com" />
            </div>
            <div className="campo full">
              <label>Contraseña *</label>
              <input type="password" value={formReg.Contraseña} onChange={e => setFormReg({...formReg, Contraseña: e.target.value})} placeholder="Crea una contraseña segura" />
            </div>
          </div>
          <button className="btn-auth" onClick={registrarUsuario}>Crear Cuenta</button>
          <button className="btn-auth-ghost" onClick={() => setModoRegistro(false)}>Volver al inicio de sesión</button>
        </div>
      </div>
    );
  }

  if (!logueado) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-logo">
            <h1 className="auth-brand">CELUACCEL</h1>
            <p className="auth-sub">Sistema de gestión de servicios</p>
          </div>
          <div className="campo">
            <label>Número de documento</label>
            <input
              id="login-user" placeholder="Tu número de documento"
              value={loginUser} onChange={e => setLoginUser(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && acceder()}
            />
          </div>
          <div className="campo">
            <label>Contraseña</label>
            <input
              id="login-pass" type="password" placeholder="Tu contraseña"
              value={loginPass} onChange={e => setLoginPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && acceder()}
            />
          </div>
          <button className="btn-auth" id="btn-login" onClick={acceder}>Iniciar Sesión</button>
          <button className="btn-auth-ghost" id="btn-registro" onClick={() => setModoRegistro(true)}>
            Registrar cuenta
          </button>
        </div>
      </div>
    );
  }

  const tabs = getTabs(userData?.rol);
  const rolLabel = userData?.rol === 1 ? 'Técnico' : userData?.rol === 3 ? 'Administrador' : 'Cliente';
  const rolColor = userData?.rol === 1 ? '#3b82f6' : userData?.rol === 3 ? '#f59e0b' : '#22c55e';

  return (
    <div className="app-wrapper">
      <nav className="app-navbar">
        <div className="navbar-brand">
          <span className="navbar-title">CELUACCEL</span>
        </div>

        <div className="navbar-tabs">
          {tabs.map(t => (
            <button
              key={t.key} id={t.id}
              className={`nav-tab ${tabActivo === t.key ? 'nav-tab-activo' : ''}`}
              onClick={() => setTabActivo(t.key)}
            >
              {t.label}
              {t.badge > 0 && <span className="nav-badge">{t.badge}</span>}
            </button>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-avatar" style={{ backgroundColor: rolColor }}>
            {userData?.nombre ? userData.nombre.charAt(0).toUpperCase() : ''}
          </div>
          <div className="user-info">
            <span className="user-nombre">{userData?.nombre || userData?.id}</span>
            <span className="user-rol" style={{ color: rolColor }}>{rolLabel}</span>
          </div>
          <button className="btn-salir" id="btn-cerrar-sesion" onClick={cerrarSesion} title="Cerrar sesión">Salir</button>
        </div>
      </nav>

      <main className="app-main">
        {tabActivo === 'servicios' && (
          <Servicios token={token()} userId={userData?.id} rol={userData?.rol} />
        )}
        {tabActivo === 'chat' && (
          <Chat token={token()} userId={userData?.id} userName={userData?.nombre} rol={userData?.rol} />
        )}
        {tabActivo === 'catalogo' && (
          <Catalogo token={token()} userId={userData?.id} rol={userData?.rol} />
        )}
        {tabActivo === 'notificaciones' && (
          <Notificaciones
            token={token()}
            userId={userData?.id}
            rol={userData?.rol}
            onChatClick={() => setTabActivo('chat')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
