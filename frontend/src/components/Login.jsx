import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setLogueado, setModoRegistro }) => {
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [toast, setToast] = useState({ visible: false, msg: '', ok: true });
  const [cargando, setCargando] = useState(false);

  const mostrarToast = (msg, ok = false) => {
    setToast({ visible: true, msg, ok });
    setTimeout(() => setToast({ visible: false, msg: '', ok: true }), 3500);
  };

  const acceder = async () => {
    const u = loginUser.trim();
    const p = loginPass.trim();
    if (!u || !p) return mostrarToast("Por favor, completa todos los campos.", false);

    setCargando(true);
    try {
      const res = await axios.post("http://localhost:3000/api/login", { user: u, password: p });
      if (res.data.auth) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', res.data.user);
        localStorage.setItem('role', res.data.role);
        setLogueado(true);
      }
    } catch (err) {
      mostrarToast("Usuario o contraseña incorrectos.", false);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') acceder();
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center"
      style={{ background: 'linear-gradient(135deg, #121212 0%, #3d0000 50%, #121212 100%)' }}>

      {toast.visible && (
        <div className={`toast show position-fixed top-0 end-0 m-3 text-white ${toast.ok ? 'bg-success' : 'bg-danger'}`}
          style={{ zIndex: 9999, minWidth: '280px' }} role="alert">
          <div className="toast-body fw-bold">{toast.msg}</div>
        </div>
      )}

      <div className="card p-4 shadow-lg border-0" style={{ width: '380px', borderRadius: '18px' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '3rem' }}>📱</div>
          <h3 className="fw-bold mt-2 mb-0" style={{ color: '#DB0000' }}>Celuaccel</h3>
          <p className="text-muted small mb-0">Sistema de Gestión de Reparaciones</p>
        </div>

        <label className="form-label fw-bold small text-muted mb-1">Número de Documento</label>
        <input
          className="form-control mb-3"
          placeholder="Ej: 1001234567"
          value={loginUser}
          onChange={e => setLoginUser(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <label className="form-label fw-bold small text-muted mb-1">Contraseña</label>
        <input
          className="form-control mb-4"
          type="password"
          placeholder="Tu contraseña..."
          value={loginPass}
          onChange={e => setLoginPass(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="btn w-100 mb-2 text-white fw-bold py-2"
          style={{ backgroundColor: '#DB0000' }}
          onClick={acceder}
          disabled={cargando}>
          {cargando ? <span className="spinner-border spinner-border-sm me-2" role="status" /> : null}
          {cargando ? 'Verificando...' : 'Ingresar al Sistema'}
        </button>

        <button className="btn w-100 fw-bold" style={{ color: '#121212', borderColor: '#121212' }}
          onClick={() => setModoRegistro(true)}>
          Crear cuenta nueva
        </button>
      </div>
    </div>
  );
};

export default Login;