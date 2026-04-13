import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import Registro from './components/Registro';
import Home from './components/Home';
import Servicios from './components/Servicios';
import Roles from './components/Roles';
import Historial from './components/Historial';
import Tipo from './components/Tipo';
import Productos from './components/Productos';
import Categorias from './components/Categorias';
import Preguntas from './components/Preguntas';
import Chats from './components/Chats';
import Comentarios from './components/Comentarios';
import Mensajes from './components/Mensajes';
import Notificaciones from './components/Notificaciones';
import Usuarios from './components/Usuarios';
import Catalogo from './components/Catalogo';
import ChatVista from './components/ChatVista';
import MiServicio from './components/MiServicio';

// RNF007 — Tiempo de inactividad antes del cierre automático de sesión (15 min)
const INACTIVIDAD_MS = 15 * 60 * 1000;

function App() {
  const [logueado, setLogueado] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [vista, setVista] = useState(localStorage.getItem('ultimaVista') || 'home');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setLogueado(true);
  }, []);

  // RNF007 — Cierre automático por inactividad de 15 minutos
  const cerrarSesion = useCallback(() => {
    localStorage.clear();
    setLogueado(false);
    setVista('home');
  }, []);

  useEffect(() => {
    if (!logueado) return;

    let timer = setTimeout(() => {
      alert('Tu sesión ha expirado por inactividad (15 minutos). Por favor inicia sesión nuevamente.');
      cerrarSesion();
    }, INACTIVIDAD_MS);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        alert('Tu sesión ha expirado por inactividad (15 minutos). Por favor inicia sesión nuevamente.');
        cerrarSesion();
      }, INACTIVIDAD_MS);
    };

    const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    eventos.forEach(e => window.addEventListener(e, resetTimer));

    return () => {
      clearTimeout(timer);
      eventos.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [logueado, cerrarSesion]);

  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
    localStorage.setItem('ultimaVista', nuevaVista);
  };

  if (!logueado) {
    return modoRegistro
      ? <Registro setModoRegistro={setModoRegistro} />
      : <Login setLogueado={setLogueado} setModoRegistro={setModoRegistro} />;
  }

  // SWITCH PARA LAS VISTAS
  switch (vista) {
    case 'home':
      return <Home cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'miServicio':
      return <MiServicio cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'roles':
      return <Roles cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'historial':
      return <Historial cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'tipo':
      return <Tipo cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'productos':
      return <Productos cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'categorias':
      return <Categorias cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'preguntas':
      return <Preguntas cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'usuarios':
      return <Usuarios cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'chats':
      return <Chats cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'comentarios':
      return <Comentarios cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'mensajes':
      return <Mensajes cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'notificaciones':
      return <Notificaciones cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'catalogo':
      return <Catalogo cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    case 'chatVista':
      return <ChatVista cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
    default:
      return <Servicios cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
  }
}

export default App;