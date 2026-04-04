import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

const iconoMap = {
  '✅': { bg: '#dcfce7', color: '#16a34a' },
  '🔧': { bg: '#dbeafe', color: '#2563eb' },
  '⏳': { bg: '#fef9c3', color: '#ca8a04' },
  '💬': { bg: '#f3e8ff', color: '#9333ea' },
  '📊': { bg: '#e0f2fe', color: '#0284c7' },
  '👤': { bg: '#f1f5f9', color: '#475569' },
  default: { bg: '#f1f5f9', color: '#475569' }
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
        <span>🔔</span>
        <p>Sin notificaciones en esta categoría 🎉</p>
      </div>
    );
  }

  return (
    <div className="notif-lista">
      {notificaciones.map(n => {
        const estilo = iconoMap[n.icono] || iconoMap.default;
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
            <div className="notif-icono" style={{ backgroundColor: estilo.bg, color: estilo.color }}>{n.icono}</div>
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
              {n.chatId && <div className="notif-link">Ver chat →</div>}
            </div>
            {!leida && <div className="notif-punto-azul" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── CLIENTE: solo sus servicios y mensajes ─────────────────────────────────────
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
    } catch (e) { console.error(e); }
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
            <span className="rol-icono">🔔</span>
            <div>
              <h2 className="section-title">
                Mis Notificaciones
                {sinLeerCount > 0 && <span className="notif-badge-title">{sinLeerCount}</span>}
              </h2>
              <p className="section-sub">Estado de tus servicios y mensajes</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-outline" onClick={cargar}>↻</button>
            {sinLeerCount > 0 && <button className="btn-ghost" onClick={marcarTodas}>✓ Marcar todas como leídas</button>}
          </div>
        </div>
      </div>

      <div className="notif-filtros">
        {[
          { key: 'todas', label: 'Todas', count: notificaciones.length },
          { key: 'sin_leer', label: 'Sin leer', count: sinLeerCount },
          { key: 'servicios', label: '🔧 Mis servicios', count: notificaciones.filter(n => n.tipo !== 'Nuevo Mensaje').length },
          { key: 'mensajes', label: '💬 Mensajes', count: notificaciones.filter(n => n.tipo === 'Nuevo Mensaje').length },
        ].map(f => (
          <button key={f.key} className={`filtro-btn ${filtro === f.key ? 'activo' : ''}`} onClick={() => setFiltro(f.key)}>
            {f.label}
            {f.count > 0 && <span className="filtro-count">{f.count}</span>}
          </button>
        ))}
      </div>

      {cargando && notificaciones.length === 0 ? (
        <div className="loading-state">Cargando notificaciones...</div>
      ) : (
        <ListaNotif notificaciones={filtradas} leidas={leidas} onMarcar={marcar} onChatClick={onChatClick} />
      )}
    </div>
  );
}

// ─── TÉCNICO: mensajes pendientes + servicios por atender ──────────────────────
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
    } catch (e) { console.error(e); }
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
            <span className="rol-icono">🔔</span>
            <div>
              <h2 className="section-title">
                Panel de Alertas Técnico
                {sinLeerCount > 0 && <span className="notif-badge-title">{sinLeerCount} pendientes</span>}
              </h2>
              <p className="section-sub">Mensajes de clientes y servicios por atender</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-outline" onClick={cargar}>↻ Actualizar</button>
            {sinLeerCount > 0 && <button className="btn-ghost" onClick={marcarTodas}>✓ Marcar todo</button>}
          </div>
        </div>
      </div>

      <div className="notif-filtros">
        {[
          { key: 'todas', label: 'Todas', count: notificaciones.length },
          { key: 'sin_leer', label: 'Pendientes', count: sinLeerCount },
          { key: 'mensajes', label: '💬 Mensajes clientes', count: notificaciones.filter(n => n.tipo === 'Nuevo Mensaje de Cliente').length },
          { key: 'servicios', label: '🔧 Servicios activos', count: notificaciones.filter(n => n.tipo === 'Servicio Pendiente').length },
        ].map(f => (
          <button key={f.key} className={`filtro-btn ${filtro === f.key ? 'activo' : ''}`} onClick={() => setFiltro(f.key)}>
            {f.label}
            {f.count > 0 && <span className="filtro-count">{f.count}</span>}
          </button>
        ))}
      </div>

      {cargando && notificaciones.length === 0 ? (
        <div className="loading-state">Cargando alertas...</div>
      ) : (
        <ListaNotif notificaciones={filtradas} leidas={leidas} onMarcar={marcar} onChatClick={onChatClick} />
      )}
    </div>
  );
}

// ─── ADMINISTRADOR: resumen del sistema ────────────────────────────────────────
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
    } catch (e) { console.error(e); }
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
    } catch (e) { alert('Error al cambiar rol.'); }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await axios.delete(`${API}/api/usuarios/eliminar/${id}`, cfg);
      cargar();
    } catch (e) { alert('Error al eliminar usuario.'); }
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
          <span className="rol-icono">⚙️</span>
          <div>
            <h2 className="section-title">Panel de Administración</h2>
            <p className="section-sub">Resumen del sistema y gestión de usuarios</p>
          </div>
        </div>
      </div>

      {/* Stats de usuarios */}
      <div className="stats-row">
        <div className="stat-card"><span className="stat-num">{usuarios.length}</span><span className="stat-label">Usuarios totales</span></div>
        <div className="stat-card azul"><span className="stat-num">{statUsers.clientes}</span><span className="stat-label">Clientes</span></div>
        <div className="stat-card verde"><span className="stat-num">{statUsers.tecnicos}</span><span className="stat-label">Técnicos</span></div>
        <div className="stat-card amarillo"><span className="stat-num">{statUsers.admins}</span><span className="stat-label">Administradores</span></div>
      </div>

      <div className="admin-layout">
        {/* Alertas del sistema */}
        <div>
          <h3 className="section-subtitle">🔔 Alertas del sistema</h3>
          {cargando ? <div className="loading-state">Cargando...</div> : (
            <ListaNotif notificaciones={notificaciones} leidas={leidas} onMarcar={marcar} />
          )}
          <button className="btn-outline" style={{ marginTop: 12 }} onClick={cargar}>↻ Actualizar</button>
        </div>

        {/* Gestión de usuarios */}
        <div>
          <h3 className="section-subtitle">👥 Gestión de usuarios</h3>
          <div className="usuarios-lista">
            {usuarios.map(u => (
              <div key={u.ID_Usuario} className="usuario-item">
                <div className="usuario-avatar">
                  {u.Nombre.charAt(0).toUpperCase()}
                </div>
                <div className="usuario-info">
                  <div className="usuario-nombre">{u.Nombre}</div>
                  <div className="usuario-meta">{u.Correo} · {u.Nombre_Documento}</div>
                  <div className="usuario-doc">Doc: {u.ID_Usuario}</div>
                </div>
                <div className="usuario-actions">
                  <span className={`rol-tag rol-${u.Codigo_Rol}`}>
                    {u.Codigo_Rol === 1 ? '🔧 Técnico' : u.Codigo_Rol === 3 ? '⚙️ Admin' : '👤 Cliente'}
                  </span>
                  <select
                    className="rol-select"
                    value={u.Codigo_Rol}
                    onChange={e => cambiarRol(u.ID_Usuario, Number(e.target.value))}
                    title="Cambiar rol"
                  >
                    <option value={2}>Cliente</option>
                    <option value={1}>Técnico</option>
                    <option value={3}>Administrador</option>
                  </select>
                  <button className="btn-eliminar" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => eliminarUsuario(u.ID_Usuario)}>
                    🗑️
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

// ─── ENRUTADOR ─────────────────────────────────────────────────────────────────
export default function Notificaciones({ token, userId, rol, onChatClick }) {
  if (rol === 1) return <NotifTecnico token={token} onChatClick={onChatClick} />;
  if (rol === 3) return <NotifAdmin token={token} userId={userId} />;
  return <NotifCliente token={token} userId={userId} onChatClick={onChatClick} />;
}
