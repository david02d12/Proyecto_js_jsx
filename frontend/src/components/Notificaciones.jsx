import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

const iconoMap = {
  'default': { bg: '#e0f2fe', color: '#0284c7' }
};

function ListaNotif({ notificaciones, leidas, onMarcar, onChatClick }) {
  const estaLeida = (n) => leidas.has(n.id) || n.leido;

  const formatFecha = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    const hoy = new Date();
    const diff = Math.floor((hoy - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Ayer';
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  };

  if (notificaciones.length === 0) {
    return (
      <div className="empty-state">
        <p>Bandeja temporalmente vacia.</p>
      </div>
    );
  }

  return (
    <div className="notif-lista">
      {notificaciones.map(n => {
        const estilo = iconoMap.default;
        const leida = estaLeida(n);
        return (
          <div
            key={n.id}
            className={`notif-item ${leida ? 'leida' : 'no-leida'}`}
            onClick={() => {
              onMarcar(n.id);
              if (n.chatId && onChatClick) onChatClick();
            }}
          >
            <div className="notif-icono" style={{ backgroundColor: estilo.bg, color: estilo.color }}>!</div>
            <div className="notif-content">
              <div className="notif-header-row">
                <span className="notif-tipo">{n.tipo}</span>
                <span className="notif-fecha">{formatFecha(n.fecha)}</span>
              </div>
              <div className="notif-titulo">{n.titulo}</div>
              <div className="notif-desc">{n.descripcion}</div>
              {n.etapa !== undefined && (
                <div className="notif-progress">
                  <div className="notif-progress-bar">
                    <div className="notif-progress-fill" style={{
                      width: `${n.etapa}%`,
                      backgroundColor: n.etapa >= 100 ? '#22c55e' : n.etapa >= 50 ? '#3b82f6' : '#f59e0b'
                    }} />
                  </div>
                  <span className="notif-progress-label">{n.etapa}%</span>
                </div>
              )}
              {n.chatId && <div className="notif-link">Abrir enlace</div>}
            </div>
            {!leida && <div className="notif-punto-azul" />}
          </div>
        );
      })}
    </div>
  );
}

function NotifCliente({ token, userId, onChatClick }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [leidas, setLeidas] = useState(new Set());
  const [filtro, setFiltro] = useState('todas');
  const [cargando, setCargando] = useState(false);
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  const cargar = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${API}/api/notificaciones/usuario/${userId}`, cfg);
      setNotificaciones(res.data);
    } catch (e) { }
    setCargando(false);
  };

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 15000);
    return () => clearInterval(t);
  }, []);

  const marcar = (id) => setLeidas(prev => new Set([...prev, id]));
  const marcarTodas = () => setLeidas(new Set(notificaciones.map(n => n.id)));
  const estaLeida = (n) => leidas.has(n.id) || n.leido;
  const sinLeerCount = notificaciones.filter(n => !estaLeida(n)).length;

  const filtradas = notificaciones.filter(n => {
    if (filtro === 'sin_leer') return !estaLeida(n);
    if (filtro === 'mensajes') return n.tipo === 'Nuevo Mensaje';
    if (filtro === 'servicios') return n.tipo !== 'Nuevo Mensaje';
    return true;
  });

  return (
    <div className="notif-container">
      <div className="page-header">
        <div className="header-row">
          <div className="rol-banner cliente-banner" style={{ flex: 1 }}>
            <div>
              <h2 className="section-title">
                Mis Notificaciones
                {sinLeerCount > 0 && <span className="notif-badge-title">{sinLeerCount}</span>}
              </h2>
              <p className="section-sub">Información relevante de tu cuenta</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-outline" onClick={cargar}>Recargar local</button>
            {sinLeerCount > 0 && <button className="btn-ghost" onClick={marcarTodas}>Borrar alertas de aviso</button>}
          </div>
        </div>
      </div>

      <div className="notif-filtros">
        {[
          { key: 'todas', label: 'Todos', count: notificaciones.length },
          { key: 'sin_leer', label: 'Nuevos', count: sinLeerCount },
          { key: 'servicios', label: 'Cambios de fase', count: notificaciones.filter(n => n.tipo !== 'Nuevo Mensaje').length },
          { key: 'mensajes', label: 'Chat', count: notificaciones.filter(n => n.tipo === 'Nuevo Mensaje').length },
        ].map(f => (
          <button key={f.key} className={`filtro-btn ${filtro === f.key ? 'activo' : ''}`} onClick={() => setFiltro(f.key)}>
            {f.label}
            {f.count > 0 && <span className="filtro-count">{f.count}</span>}
          </button>
        ))}
      </div>

      {cargando && notificaciones.length === 0 ? (
        <div className="loading-state">Desplegando lista...</div>
      ) : (
        <ListaNotif notificaciones={filtradas} leidas={leidas} onMarcar={marcar} onChatClick={onChatClick} />
      )}
    </div>
  );
}

function NotifTecnico({ token, onChatClick }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [leidas, setLeidas] = useState(new Set());
  const [filtro, setFiltro] = useState('todas');
  const [cargando, setCargando] = useState(false);
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  const cargar = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${API}/api/notificaciones/tecnico`, cfg);
      setNotificaciones(res.data);
    } catch (e) { }
    setCargando(false);
  };

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 15000);
    return () => clearInterval(t);
  }, []);

  const marcar = (id) => setLeidas(prev => new Set([...prev, id]));
  const marcarTodas = () => setLeidas(new Set(notificaciones.map(n => n.id)));
  const estaLeida = (n) => leidas.has(n.id) || n.leido;
  const sinLeerCount = notificaciones.filter(n => !estaLeida(n)).length;

  const filtradas = notificaciones.filter(n => {
    if (filtro === 'sin_leer') return !estaLeida(n);
    if (filtro === 'mensajes') return n.tipo === 'Nuevo Mensaje de Cliente';
    if (filtro === 'servicios') return n.tipo === 'Servicio Pendiente';
    return true;
  });

  return (
    <div className="notif-container">
      <div className="page-header">
        <div className="header-row">
          <div className="rol-banner tecnico-banner" style={{ flex: 1 }}>
            <div>
              <h2 className="section-title">
                Notificaciones Sistema Empleado
                {sinLeerCount > 0 && <span className="notif-badge-title">{sinLeerCount} registro de espera</span>}
              </h2>
              <p className="section-sub">Datos por requerir intervención</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-outline" onClick={cargar}>Re-sincronizar</button>
            {sinLeerCount > 0 && <button className="btn-ghost" onClick={marcarTodas}>Lectura masiva</button>}
          </div>
        </div>
      </div>

      <div className="notif-filtros">
        {[
          { key: 'todas', label: 'Cualquiera', count: notificaciones.length },
          { key: 'sin_leer', label: 'No revisados', count: sinLeerCount },
          { key: 'mensajes', label: 'Mensajes a soporte', count: notificaciones.filter(n => n.tipo === 'Nuevo Mensaje de Cliente').length },
          { key: 'servicios', label: 'Tickets generados', count: notificaciones.filter(n => n.tipo === 'Servicio Pendiente').length },
        ].map(f => (
          <button key={f.key} className={`filtro-btn ${filtro === f.key ? 'activo' : ''}`} onClick={() => setFiltro(f.key)}>
            {f.label}
            {f.count > 0 && <span className="filtro-count">{f.count}</span>}
          </button>
        ))}
      </div>

      {cargando && notificaciones.length === 0 ? (
        <div className="loading-state">Procesando cola...</div>
      ) : (
        <ListaNotif notificaciones={filtradas} leidas={leidas} onMarcar={marcar} onChatClick={onChatClick} />
      )}
    </div>
  );
}

function NotifAdmin({ token, userId }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [leidas, setLeidas] = useState(new Set());
  const [cargando, setCargando] = useState(false);
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  const cargar = async () => {
    setCargando(true);
    try {
      const [rNotif, rUsers] = await Promise.all([
        axios.get(`${API}/api/notificaciones/admin`, cfg),
        axios.get(`${API}/api/usuarios/listar`, cfg)
      ]);
      setNotificaciones(rNotif.data);
      setUsuarios(rUsers.data);
    } catch (e) { }
    setCargando(false);
  };

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 20000);
    return () => clearInterval(t);
  }, []);

  const marcar = (id) => setLeidas(prev => new Set([...prev, id]));
  const cambiarRol = async (idUsuario, nuevoRol) => {
    try {
      await axios.put(`${API}/api/usuarios/cambiar-rol`, { idUsuario, nuevoRol }, cfg);
      cargar();
    } catch (e) { alert('Error modificando variable de DB.'); }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('Eliminar entrada permanentemente?')) return;
    try {
      await axios.delete(`${API}/api/usuarios/eliminar/${id}`, cfg);
      cargar();
    } catch (e) { alert('Fallo query delete.'); }
  };

  const statUsers = {
    clientes: usuarios.filter(u => u.Codigo_Rol === 2).length,
    tecnicos: usuarios.filter(u => u.Codigo_Rol === 1).length,
    admins: usuarios.filter(u => u.Codigo_Rol === 3).length,
  };

  return (
    <div className="notif-container" style={{ maxWidth: '100%' }}>
      <div className="page-header">
        <div className="rol-banner admin-banner">
          <div>
            <h2 className="section-title">Monitor de Control y Permisos</h2>
            <p className="section-sub">Administración de niveles de acceso del sistema</p>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><span className="stat-num">{usuarios.length}</span><span className="stat-label">Cuentas vinculadas</span></div>
        <div className="stat-card azul"><span className="stat-num">{statUsers.clientes}</span><span className="stat-label">Rol 2: Base</span></div>
        <div className="stat-card verde"><span className="stat-num">{statUsers.tecnicos}</span><span className="stat-label">Rol 1: Personal</span></div>
        <div className="stat-card amarillo"><span className="stat-num">{statUsers.admins}</span><span className="stat-label">Rol 3: Root</span></div>
      </div>

      <div className="admin-layout">
        <div>
          <h3 className="section-subtitle">Tabla DB: Notificaciones</h3>
          {cargando ? <div className="loading-state">Leyendo tabla...</div> : (
            <ListaNotif notificaciones={notificaciones} leidas={leidas} onMarcar={marcar} />
          )}
          <button className="btn-outline" style={{ marginTop: 12 }} onClick={cargar}>Call endpoint list</button>
        </div>

        <div>
          <h3 className="section-subtitle">Tabla DB: Cuentas</h3>
          <div className="usuarios-lista">
            {usuarios.map(u => (
              <div key={u.ID_Usuario} className="usuario-item">
                <div className="usuario-avatar">
                  {u.Nombre.charAt(0).toUpperCase()}
                </div>
                <div className="usuario-info">
                  <div className="usuario-nombre">{u.Nombre}</div>
                  <div className="usuario-meta">{u.Correo} - {u.Nombre_Documento}</div>
                  <div className="usuario-doc">Doc_ID: {u.ID_Usuario}</div>
                </div>
                <div className="usuario-actions">
                  <span className={`rol-tag rol-${u.Codigo_Rol}`}>
                    {u.Codigo_Rol === 1 ? 'Nivel Medio' : u.Codigo_Rol === 3 ? 'Nivel Alto' : 'Nivel Bajo'}
                  </span>
                  <select
                    className="rol-select"
                    value={u.Codigo_Rol}
                    onChange={e => cambiarRol(u.ID_Usuario, Number(e.target.value))}
                  >
                    <option value={2}>Cliente 2</option>
                    <option value={1}>Trabajador 1</option>
                    <option value={3}>SuperUser 3</option>
                  </select>
                  <button className="btn-eliminar" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => eliminarUsuario(u.ID_Usuario)}>
                    Drop Row
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Notificaciones({ token, userId, rol, onChatClick }) {
  if (rol === 1) return <NotifTecnico token={token} onChatClick={onChatClick} />;
  if (rol === 3) return <NotifAdmin token={token} userId={userId} />;
  return <NotifCliente token={token} userId={userId} onChatClick={onChatClick} />;
}
