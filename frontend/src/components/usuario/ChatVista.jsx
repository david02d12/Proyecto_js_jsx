import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ChatVista = ({ cerrarSesion, setVista }) => {
  const [chats, setChats] = useState([]);
  const [chatSel, setChatSel] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [busquedaChat, setBusquedaChat] = useState('');
  const [cargando, setCargando] = useState(false);
  const mensajesEndRef = useRef(null);
  const usuario = localStorage.getItem('user') || 'Usuario';
  const role = Number(localStorage.getItem('role')) || 2;

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    cargarChats();
  }, []);

  useEffect(() => {
    if (chatSel) cargarMensajes(chatSel.Codigo_Chat);
  }, [chatSel]);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const cargarChats = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/chats/listar', config());
      let chatsCargados = res.data;

      // Enlace Automático desde MiServicio
      const chatInfoRaw = localStorage.getItem('chatInfo');
      if (chatInfoRaw) {
        const info = JSON.parse(chatInfoRaw);
        let chatExistente = chatsCargados.find(c => String(c.ID_Servicio) === String(info.ID_Servicio));
        
        if (chatExistente) {
          setChatSel(chatExistente);
        } else {
          // Auto-crear sala de chat si es nuevo
          const payload = { ID_Usuario: usuario, ID_Servicio: info.ID_Servicio };
          await axios.post('http://localhost:3000/api/chats/agregar', payload, config());
          
          const resUpdated = await axios.get('http://localhost:3000/api/chats/listar', config());
          chatsCargados = resUpdated.data;
          chatExistente = chatsCargados.find(c => String(c.ID_Servicio) === String(info.ID_Servicio));
          if (chatExistente) setChatSel(chatExistente);
        }
        localStorage.removeItem('chatInfo'); // Destruir maletín temporal
      }

      setChats(chatsCargados);
    } catch (err) {
      console.error('Error al cargar chats:', err);
    }
  };

  const cargarMensajes = async (codigoChat) => {
    try {
      setCargando(true);
      const res = await axios.get('http://localhost:3000/api/mensajes/listar', config());
      const filtrados = res.data.filter(m => String(m.Codigo_Chat) === String(codigoChat));
      setMensajes(filtrados);
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
    } finally {
      setCargando(false);
    }
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !chatSel) return;

    const payload = {
      Codigo_Chat: chatSel.Codigo_Chat,
      ID_Usuario: usuario,
      Mensaje: nuevoMensaje.trim(),
      Estado: 'Enviado',
    };

    try {
      await axios.post('http://localhost:3000/api/mensajes/agregar', payload, config());
      setNuevoMensaje('');
      cargarMensajes(chatSel.Codigo_Chat);
    } catch (err) {
      alert('Error al enviar el mensaje. Verifica que los campos sean correctos.');
    }
  };

  const eliminarMensaje = async (id) => {
    if (!window.confirm('¿Eliminar este mensaje?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/mensajes/eliminar/${id}`, config());
      cargarMensajes(chatSel.Codigo_Chat);
    } catch (err) {
      alert('Error al eliminar el mensaje.');
    }
  };

  const chatsFiltrados = chats.filter(c =>
    String(c.Codigo_Chat).includes(busquedaChat) ||
    String(c.ID_Servicio).includes(busquedaChat) ||
    String(c.ID_Usuario).toLowerCase().includes(busquedaChat.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR */}
      <Navbar titulo="CELUACCEL — Soporte en Línea" cerrarSesion={cerrarSesion} />

      {/* CUERPO DEL CHAT */}
      <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>

        {/* PANEL IZQUIERDO — LISTA DE CHATS (SOLO PARA TÉCNICOS Y ADMIN) */}
        {role !== 2 && (
          <div className="d-flex flex-column border-end" style={{ width: '300px', minWidth: '260px', backgroundColor: '#f8f9fa' }}>
            <div className="p-3 border-bottom" style={{ backgroundColor: '#121212' }}>
              <p className="text-white fw-bold mb-2 small">Conversaciones Abiertas</p>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder=" Buscar chat (ID o Usuario)..."
                value={busquedaChat}
                onChange={e => setBusquedaChat(e.target.value)}
              />
            </div>
            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
              {chatsFiltrados.length === 0 ? (
                <p className="text-muted text-center small p-3">No hay chats disponibles.</p>
              ) : (
                chatsFiltrados.map(c => (
                  <div
                    key={c.Codigo_Chat}
                    className="p-3 border-bottom"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: chatSel?.Codigo_Chat === c.Codigo_Chat ? '#DB0000' : 'transparent',
                      color: chatSel?.Codigo_Chat === c.Codigo_Chat ? 'white' : 'inherit',
                      transition: 'background-color .15s'
                    }}
                    onClick={() => setChatSel(c)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: '40px', height: '40px', minWidth: '40px', backgroundColor: '#121212', fontSize: '0.8rem' }}>
                        {String(c.ID_Usuario).substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold small">Chat #{c.Codigo_Chat}</div>
                        <div className="small opacity-75">Servicio #{c.ID_Servicio} · {c.ID_Usuario}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PANEL DERECHO — MENSAJES */}
        <div className="d-flex flex-column flex-grow-1" style={{ overflow: 'hidden', backgroundColor: '#fff' }}>
          {!chatSel ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
              <div style={{ fontSize: '4rem' }}></div>
              <h5 className="mt-3">{role === 2 ? 'Accede desde "Mis Servicios"' : 'Selecciona un chat'}</h5>
              <p className="small text-center px-4">
                {role === 2 
                  ? 'Dirígete a tu Panel de Servicios y haz clic en "Chat con Asesor" sobre el equipo del que deseas hablar.' 
                  : 'Elige una conversación de la lista lateral para ver los mensajes y responder al cliente.'}
              </p>
            </div>
          ) : (
            <>
              {/* CABECERA DEL CHAT */}
              <div className="p-3 border-bottom d-flex align-items-center gap-3" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{ width: '44px', height: '44px', backgroundColor: '#DB0000', fontSize: '0.9rem' }}>
                  {String(chatSel.ID_Usuario).substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="fw-bold">Chat #{chatSel.Codigo_Chat}</div>
                  <div className="small text-muted">Servicio #{chatSel.ID_Servicio} · {chatSel.ID_Usuario}</div>
                </div>
              </div>

              {/* MENSAJES */}
              <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', backgroundColor: '#fafafa' }}>
                {cargando ? (
                  <div className="text-center py-4 text-muted">Cargando mensajes...</div>
                ) : mensajes.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <p>No hay mensajes en este chat aún.</p>
                    <p className="small">Sé el primero en escribir.</p>
                  </div>
                ) : (
                  mensajes.map(m => {
                    const esMio = String(m.ID_Usuario) === String(usuario);
                    return (
                      <div key={m.Codigo_Mensaje}
                        className={`d-flex mb-3 ${esMio ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div style={{ maxWidth: '70%' }}>
                          <div
                            className="p-3 rounded-3 shadow-sm"
                            style={{
                              backgroundColor: esMio ? '#DB0000' : '#121212',
                              color: 'white',
                              borderRadius: esMio ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            }}>
                            <div className="small fw-bold opacity-75 mb-1">{m.ID_Usuario}</div>
                            <div>{m.Mensaje}</div>
                          </div>
                          <div className={`d-flex mt-1 gap-2 ${esMio ? 'justify-content-end' : ''}`}>
                            <small className="text-muted">{m.Fecha_Mensaje}</small>
                            {esMio && (
                              <small className="text-danger" style={{ cursor: 'pointer' }}
                                onClick={() => eliminarMensaje(m.Codigo_Mensaje)}>
                                🗑 Eliminar
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={mensajesEndRef} />
              </div>

              {/* INPUT DE MENSAJE */}
              <div className="p-3 border-top" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escribe un mensaje... (Enter para enviar)"
                    value={nuevoMensaje}
                    onChange={e => setNuevoMensaje(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="btn text-white fw-bold px-4"
                    style={{ backgroundColor: '#DB0000', minWidth: '80px' }}
                    onClick={enviarMensaje}
                    disabled={!nuevoMensaje.trim()}>
                    Enviar
                  </button>
                </div>
                <small className="text-muted mt-1 d-block">
                  Enviando como: <strong>{usuario}</strong> · Chat #{chatSel.Codigo_Chat}
                </small>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MENÚ LATERAL */}
      <div className="offcanvas offcanvas-start text-white" tabIndex="-1" id="menuGlobal" style={{ backgroundColor: '#121212' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-bold">Menú de Navegación</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <Sidebar setVista={setVista} />
    </div>
    </div>
  );
};

export default ChatVista;
