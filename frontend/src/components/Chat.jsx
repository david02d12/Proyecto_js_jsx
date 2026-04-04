import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

function PanelMensajes({ chat, token, userId, onVolver }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const endRef = useRef(null);
  const pollingRef = useRef(null);
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  const cargar = async () => {
    try {
      const res = await axios.get(`${API}/api/mensajes/${chat.Codigo_Chat}`, cfg);
      setMensajes(res.data);
      await axios.put(`${API}/api/mensajes/leer/${chat.Codigo_Chat}`, { idUsuario: userId }, cfg);
    } catch (e) { }
  };

  useEffect(() => {
    cargar();
    pollingRef.current = setInterval(cargar, 4000);
    return () => clearInterval(pollingRef.current);
  }, [chat.Codigo_Chat]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviar = async () => {
    const t = texto.trim();
    if (!t) return;
    setEnviando(true);
    try {
      await axios.post(`${API}/api/mensajes/enviar`, { Codigo_Chat: chat.Codigo_Chat, ID_Usuario: userId, Mensaje: t }, cfg);
      setTexto('');
      cargar();
    } catch (e) { alert('Error al enviar.'); }
    setEnviando(false);
  };

  const formatFecha = (f) => {
    if (!f) return '';
    return new Date(f).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="chat-header">
        {onVolver && (
          <button className="btn-volver" onClick={onVolver}>Volver</button>
        )}
        <div className="chat-avatar grande">{(chat.Nombre_Usuario || 'U').charAt(0).toUpperCase()}</div>
        <div className="chat-header-info">
          <div className="chat-header-nombre">{chat.Nombre_Usuario || chat.ID_Usuario}</div>
          <div className="chat-header-servicio">{chat.Movil_Nombre} - {chat.Descripcion_Servicio}</div>
          <div className="chat-header-etapa">
            <span className="etapa-dot" style={{ backgroundColor: chat.Etapa >= 100 ? '#22c55e' : chat.Etapa >= 50 ? '#3b82f6' : '#f59e0b' }} />
            Etapa proceso: {chat.Etapa}%
          </div>
        </div>
      </div>

      <div className="mensajes-area">
        {mensajes.length === 0 ? (
          <div className="sin-mensajes">No hay comunicacion previa registrada</div>
        ) : mensajes.map((m, i) => {
          const esMio = String(m.ID_Usuario) === String(userId);
          return (
            <div key={i} className={`mensaje-wrapper ${esMio ? 'mensaje-mio' : 'mensaje-otro'}`}>
              {!esMio && <div className="mensaje-nombre">{m.Nombre_Remitente}</div>}
              <div className={`burbuja ${esMio ? 'burbuja-mia' : 'burbuja-otra'}`}>
                <div className="burbuja-texto">{m.Mensaje}</div>
                <div className="burbuja-meta">
                  {formatFecha(m.Fecha_Mensaje)}
                  {esMio && <span className={`tick ${m.Estado === 1 ? 'leido' : ''}`}>{m.Estado === 1 ? ' Leido' : ' '}</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="mensaje-input-area">
        <textarea
          className="mensaje-input"
          rows={2}
          placeholder="Escribir comunicacion nueva..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
          disabled={enviando}
        />
        <button className={`btn-enviar ${enviando ? 'enviando' : ''}`} onClick={enviar} disabled={enviando || !texto.trim()}>
          {enviando ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}

function ListaChats({ chats, chatActivo, onSeleccionar, busqueda, onBusqueda }) {
  const filtrados = chats.filter(c =>
    c.Nombre_Usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.Movil_Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.Descripcion_Servicio?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <aside className="chat-sidebar">
      <div className="chat-search-box">
        <input className="search-input" placeholder="Buscar conversacion..." value={busqueda} onChange={e => onBusqueda(e.target.value)} />
      </div>
      <div className="chat-list">
        {filtrados.length === 0 ? (
          <div className="empty-chats">Registro vacio en conversaciones</div>
        ) : filtrados.map(chat => (
          <div
            key={chat.Codigo_Chat}
            className={`chat-item ${chatActivo?.Codigo_Chat === chat.Codigo_Chat ? 'chat-item-activo' : ''}`}
            onClick={() => onSeleccionar(chat)}
          >
            <div className="chat-avatar">{(chat.Nombre_Usuario || 'U').charAt(0).toUpperCase()}</div>
            <div className="chat-item-info">
              <div className="chat-item-header">
                <span className="chat-usuario">{chat.Nombre_Usuario || chat.ID_Usuario}</span>
                {chat.Mensajes_Sin_Leer > 0 && <span className="badge-unread">{chat.Mensajes_Sin_Leer}</span>}
              </div>
              <div className="chat-movil">{chat.Movil_Nombre}</div>
              <div className="chat-servicio-desc">{chat.Descripcion_Servicio}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ChatCliente({ token, userId }) {
  const [chats, setChats] = useState([]);
  const [chatActivo, setChatActivo] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get(`${API}/api/chat/listar`, cfg);
        setChats(res.data.filter(c => String(c.ID_Usuario) === String(userId)));
      } catch (e) { }
    };
    cargar();
  }, []);

  return (
    <div className="chat-container">
      <div className="page-header">
        <div className="rol-banner cliente-banner">
          <div>
            <h2 className="section-title">Canal de Conversación</h2>
            <p className="section-sub">Atención personalizada con el técnico de servicio</p>
          </div>
        </div>
      </div>
      <div className="chat-layout">
        <ListaChats chats={chats} chatActivo={chatActivo} onSeleccionar={setChatActivo} busqueda={busqueda} onBusqueda={setBusqueda} />
        <main className="chat-main">
          {!chatActivo ? (
            <div className="chat-placeholder">
              <h3>Panel interactivo</h3>
              <p>Seleccionar historial requerido a la izquierda</p>
            </div>
          ) : (
            <PanelMensajes chat={chatActivo} token={token} userId={userId} />
          )}
        </main>
      </div>
    </div>
  );
}

function ChatTecnico({ token, userId }) {
  const [chats, setChats] = useState([]);
  const [chatActivo, setChatActivo] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  const cargar = async () => {
    try {
      const res = await axios.get(`${API}/api/chat/listar`, cfg);
      setChats(res.data);
    } catch (e) { }
  };

  useEffect(() => { cargar(); }, []);

  const chatsFiltrados = chats.filter(c => {
    const coincide =
      c.Nombre_Usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.Movil_Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.Descripcion_Servicio?.toLowerCase().includes(busqueda.toLowerCase());
    if (filtro === 'sin_leer') return coincide && c.Mensajes_Sin_Leer > 0;
    if (filtro === 'activos') return coincide && c.Etapa < 100;
    if (filtro === 'completados') return coincide && c.Etapa >= 100;
    return coincide;
  });

  const totalSinLeer = chats.reduce((acc, c) => acc + (c.Mensajes_Sin_Leer || 0), 0);

  return (
    <div className="chat-container">
      <div className="page-header">
        <div className="rol-banner tecnico-banner">
          <div>
            <h2 className="section-title">
              Atención a clientes
              {totalSinLeer > 0 && <span className="notif-badge-title">{totalSinLeer} notificaciones</span>}
            </h2>
            <p className="section-sub">Consultas activas con usuarios registrados</p>
          </div>
        </div>
      </div>

      <div className="notif-filtros" style={{ marginBottom: 12 }}>
        {[['todos','Todos'],['sin_leer','Pendientes'],['activos','Trabajo activo'],['completados','Finalizados']].map(([k,v]) => (
          <button key={k} className={`filtro-btn ${filtro === k ? 'activo' : ''}`} onClick={() => setFiltro(k)}>
            {v}
            {k === 'sin_leer' && totalSinLeer > 0 && <span className="filtro-count">{totalSinLeer}</span>}
          </button>
        ))}
        <button className="btn-outline" style={{ marginLeft: 'auto' }} onClick={cargar}>Refrescar tabla</button>
      </div>

      <div className="chat-layout">
        <ListaChats chats={chatsFiltrados} chatActivo={chatActivo} onSeleccionar={setChatActivo} busqueda={busqueda} onBusqueda={setBusqueda} />
        <main className="chat-main">
          {!chatActivo ? (
            <div className="chat-placeholder">
              <h3>Panel principal de respuesta</h3>
              <p>Dar clic a un elemento lateral para interactuar</p>
              {totalSinLeer > 0 && (
                <div className="alerta-sin-leer">
                  Hay <strong>{totalSinLeer}</strong> contacto(s) en espera de resolucion
                </div>
              )}
            </div>
          ) : (
            <PanelMensajes chat={chatActivo} token={token} userId={userId} />
          )}
        </main>
      </div>
    </div>
  );
}

function ChatAdmin({ token, userId }) {
  const [chats, setChats] = useState([]);
  const [chatActivo, setChatActivo] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [vista, setVista] = useState('lista');
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  const cargar = async () => {
    try {
      const res = await axios.get(`${API}/api/chat/listar`, cfg);
      setChats(res.data);
    } catch (e) { }
  };

  useEffect(() => { cargar(); }, []);

  const seleccionarChat = (chat) => {
    setChatActivo(chat);
    setVista('chat');
  };

  const totalSinLeer = chats.reduce((acc, c) => acc + (c.Mensajes_Sin_Leer || 0), 0);
  const stats = {
    total: chats.length,
    sinLeer: totalSinLeer,
    activos: chats.filter(c => c.Etapa < 100).length,
    completados: chats.filter(c => c.Etapa >= 100).length,
  };

  return (
    <div className="chat-container">
      <div className="page-header">
        <div className="rol-banner admin-banner">
          <div>
            <h2 className="section-title">Vista General de Interacciones</h2>
            <p className="section-sub">Inspeccion global de los flujos de texto del personal</p>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><span className="stat-num">{stats.total}</span><span className="stat-label">Total logs</span></div>
        <div className="stat-card rojo"><span className="stat-num">{stats.sinLeer}</span><span className="stat-label">No contestados</span></div>
        <div className="stat-card amarillo"><span className="stat-num">{stats.activos}</span><span className="stat-label">Pendientes</span></div>
        <div className="stat-card verde"><span className="stat-num">{stats.completados}</span><span className="stat-label">Finalizados</span></div>
      </div>

      <div className="chat-layout">
        <ListaChats chats={chats} chatActivo={chatActivo} onSeleccionar={seleccionarChat} busqueda={busqueda} onBusqueda={setBusqueda} />
        <main className="chat-main">
          {!chatActivo ? (
            <div className="chat-placeholder">
              <h3>Sección administrativa</h3>
              <p>Seleccionar nodo izquierdo para visualización</p>
              <button className="btn-outline" style={{ marginTop: 12 }} onClick={cargar}>F5 Recargar</button>
            </div>
          ) : (
            <PanelMensajes
              chat={chatActivo}
              token={token}
              userId={userId}
              onVolver={() => { setChatActivo(null); setVista('lista'); }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function Chat({ token, userId, userName, rol }) {
  if (rol === 2) return <ChatCliente token={token} userId={userId} />;
  if (rol === 1) return <ChatTecnico token={token} userId={userId} />;
  return <ChatAdmin token={token} userId={userId} />;
}
