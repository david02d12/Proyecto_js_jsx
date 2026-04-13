import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setLogueado, setModoRegistro }) => {
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const acceder = async () => {
    const u = loginUser.trim();
    const p = loginPass.trim();
    if (!u || !p) return alert("Por favor, completa los campos.");
    
    try {
      const res = await axios.post("http://localhost:3000/api/login", { user: u, password: p });
      if (res.data.auth) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', res.data.user);
        setLogueado(true);
      }
    } catch (err) { alert("Usuario o contraseña incorrectos."); }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-sm border-0" style={{width: '320px', background: '#f8f9fa'}}>
        <h3 className="text-center mb-4 fw-bold" style={{ color: '#DB0000' }}>Sistema Celuaccel</h3>
        <h3 className="text-center mb-4 fw-bold" style={{ color: '#DB0000' }}>Iniciar Sesión</h3>
        <input className="form-control mb-2" placeholder="Documento" onChange={e => setLoginUser(e.target.value)} />
        <input className="form-control mb-3" type="password" placeholder="Contraseña" onChange={e => setLoginPass(e.target.value)} />
        <button className="btn w-100 mb-2 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={acceder}>Entrar</button>
        <button className="btn w-100 fw-bold" style={{ color: '#121212', borderColor: '#121212' }} onClick={() => setModoRegistro(true)}>Crear Usuario</button>
      </div>
    </div>
  );
};

export default Login;