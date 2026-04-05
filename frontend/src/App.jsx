import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import Login from './components/Login';
import Registro from './components/Registro';
import Servicios from './components/Servicios';
import Roles from './components/Roles';
import Historial from './components/Historial';
import Tipo from './components/Tipo';

function App() {
  const [logueado, setLogueado] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [vista, setVista] = useState('servicios');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setLogueado(true);
  }, []);

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


  switch (vista) {
case 'roles':
      return <Roles cerrarSesion={cerrarSesion} setVista={setVista} />;
    case 'historial':
      return <Historial cerrarSesion={cerrarSesion} setVista={setVista} />;
    case 'tipo':
      return <Tipo cerrarSesion={cerrarSesion} setVista={setVista} />;
    default:
      return <Servicios cerrarSesion={cerrarSesion} setVista={setVista} />;
  }
}

export default App;
