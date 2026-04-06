import React from 'react';

const Login = ({ auth, setAuth, handleLogin }) => {
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="container" style={{ textAlign: 'center', padding: '40px 20px' }}> 
      <div style={{ fontSize: '3rem', color: 'var(--gold)', marginBottom: '10px' }}>
        <i className="fas fa-database"></i> 
      </div>

      <h2 style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
        CeluAccel Admin
      </h2>
      <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '30px' }}>
        Panel de Control de Inventario
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
        <input 
          type="text" 
          placeholder="Usuario o Email" 
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', background: '#1a1a1a', color: 'white' }}
          value={auth.email || ''} 
          onChange={e => setAuth({ ...auth, email: e.target.value })} 
          onKeyDown={handleKeyDown}
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', background: '#1a1a1a', color: 'white' }}

          value={auth.pass || ''} 
          onChange={e => setAuth({ ...auth, pass: e.target.value })} 
          onKeyDown={handleKeyDown}
        />

        <button 
          className="gold-button" 
          style={{ marginTop: '10px', padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={handleLogin}
        >
          AUTENTICAR
        </button>
      </div>

      <p style={{ marginTop: '25px', fontSize: '11px', color: '#666' }}>
        Conexión Segura a DB: <span style={{ color: '#4caf50' }}>celuaccel</span>
      </p>
    </div>
  );
};

export default Login;
