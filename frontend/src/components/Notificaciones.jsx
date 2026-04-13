import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axios from 'axios';

const Notificaciones = ({ cerrarSesion, setVista }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({
    Codigo_Notificaciones: '',
    Tipo_Notificacion: ''
  });

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    listar();
  }, []);

  const listar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/notificaciones/listar', config());
      setNotificaciones(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const guardar = async () => {
    try {
      const url = enEdicion ? 'actualizar' : 'agregar';
      const metodo = enEdicion ? 'put' : 'post';
      
      await axios[metodo](`http://localhost:3000/api/notificaciones/${url}`, form, config());
      
      listar();
      limpiar();
    } catch (err) {
      alert("Error al procesar la notificación. Verifique que el código no esté duplicado.");
    }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar esta notificación?")) {
      try {
        await axios.delete(`http://localhost:3000/api/notificaciones/eliminar/${id}`, config());
        listar();
      } catch (err) {
        alert("Error al eliminar la notificación");
      }
    }
  };

  const limpiar = () => {
    setForm({ Codigo_Notificaciones: '', Tipo_Notificacion: '' });
    setEnEdicion(false);
  };

  return (
    <div>
      {/* NAVBAR */}
      <Navbar titulo="CELUACCEL — Gestión" cerrarSesion={cerrarSesion} />

      <div className="container mt-4">
        <div className="row">
          {/* FORMULARIO */}
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5>{enEdicion ? "Editar Notificación" : "Nueva Notificación"}</h5>
              <label className="small fw-bold">Código (Manual)</label>
              <input 
                className="form-control mb-2" 
                type="number"
                placeholder="Ej: 101" 
                value={form.Codigo_Notificaciones} 
                disabled={enEdicion}
                onChange={e => setForm({...form, Codigo_Notificaciones: e.target.value})} 
              />
              <label className="small fw-bold">Tipo de Notificación</label>
              <input 
                className="form-control mb-2" 
                placeholder="Ej: Alerta de Stock" 
                value={form.Tipo_Notificacion} 
                onChange={e => setForm({...form, Tipo_Notificacion: e.target.value})} 
              />
              
              <button className="btn w-100 text-white fw-bold mt-2" style={{ backgroundColor: '#DB0000' }} onClick={guardar}>
                {enEdicion ? "Actualizar" : "Guardar"}
              </button>
              {enEdicion && (
                <button className="btn btn-secondary w-100 mt-2" onClick={limpiar}>Cancelar</button>
              )}
            </div>
          </div>

          {/* TABLA DE DATOS */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="p-3 border-bottom">
                <input type="text" className="form-control"
                  placeholder=" Buscar por código o tipo de notificación..."
                  value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              </div>
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Código</th>
                    <th>Tipo de Notificación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {notificaciones.filter(n =>
                    String(n.Codigo_Notificaciones).includes(busqueda) ||
                    String(n.Tipo_Notificacion || '').toLowerCase().includes(busqueda.toLowerCase())
                  ).map(n => (
                    <tr key={n.Codigo_Notificaciones}>
                      <td className="fw-bold">{n.Codigo_Notificaciones}</td>
                      <td>{n.Tipo_Notificacion}</td>
                      <td>
                        <button 
                          className="btn btn-sm me-1 text-white" 
                          style={{ backgroundColor: '#121212' }} 
                          onClick={() => { setForm(n); setEnEdicion(true); }}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm text-white" 
                          style={{ backgroundColor: '#DB0000' }} 
                          onClick={() => eliminar(n.Codigo_Notificaciones)}
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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

export default Notificaciones;