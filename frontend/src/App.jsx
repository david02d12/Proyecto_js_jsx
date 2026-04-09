import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import Registro from './components/Registro';
import Servicios from './components/Servicios';
import Roles from './components/Roles';
import Historial from './components/Historial';
import Tipo from './components/Tipo';
import Productos from './components/Productos';
import Categorias from './components/Categorias';
import Preguntas from './components/Preguntas';

function App() {
  const [logueado, setLogueado] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);
  // AQUI SE CAMBIA LA RUTA POR DEFECTO
  const [vista, setVista] = useState(localStorage.getItem('ultimaVista') || 'servicios');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setLogueado(true);
  }, []);

  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
    localStorage.setItem('ultimaVista', nuevaVista);
  };

  const cerrarSesion = () => {
    localStorage.clear();
    setLogueado(false);
    setVista('servicios');
  };

  if (!logueado) {
    return modoRegistro 
      ? <Registro setModoRegistro={setModoRegistro} /> 
      : <Login setLogueado={setLogueado} setModoRegistro={setModoRegistro} />;
  }

  // SWITCH PARA LAS VISTAS
  switch (vista) {
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
    default:
      return <Servicios cerrarSesion={cerrarSesion} setVista={cambiarVista} />;
  }
}

export default App;