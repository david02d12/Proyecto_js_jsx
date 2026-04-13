import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import axios from 'axios';

const Comentarios = ({ cerrarSesion, setVista }) => {
  const miUsuario = localStorage.getItem('user') || '';
  const miRol = Number(localStorage.getItem('role')) || 2;

  const [comentarios, setComentarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({
    Codigo_Comentario: '',
    ID_Usuario: miUsuario,
    Comentario: '',
    Fecha_Comentario: ''
  });

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    listar();
  }, []);

  const listar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/comentarios/listar', config());
      if (miRol === 2) {
        setComentarios(res.data.filter(c => c.ID_Usuario === miUsuario));
      } else {
        setComentarios(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const guardar = async () => {
    try {
      const url = enEdicion ? 'actualizar' : 'agregar';
      const metodo = enEdicion ? 'put' : 'post';
      
      await axios[metodo](`http://localhost:3000/api/comentarios/${url}`, form, config());
      
      listar();
      limpiar();
    } catch (err) {
      alert("Error al procesar el comentario");
    }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar comentario?")) {
      try {
        await axios.delete(`http://localhost:3000/api/comentarios/eliminar/${id}`, config());
        listar();
      } catch (err) {
        alert("Error al eliminar comentario");
      }
    }
  };

  const limpiar = () => {
    setForm({ Codigo_Comentario: '', ID_Usuario: miUsuario, Comentario: '', Fecha_Comentario: '' });
    setEnEdicion(false);
  };

  return (
    <div>
      <Navbar titulo="CELUACCEL — Gestión" cerrarSesion={cerrarSesion} />

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5>{enEdicion ? "Editar Comentario" : "Nuevo Comentario"}</h5>
              <input 
                className="form-control mb-2" 
                placeholder="ID Usuario" 
                value={form.ID_Usuario} 
                disabled={enEdicion || miRol === 2}
                onChange={e => setForm({...form, ID_Usuario: e.target.value})} 
              />
              <textarea 
                className="form-control mb-2" 
                placeholder="Escribe tu comentario..." 
                value={form.Comentario} 
                onChange={e => setForm({...form, Comentario: e.target.value})}
                rows="3"
              />
              <input 
                className="form-control mb-2" 
                type="date" 
                value={form.Fecha_Comentario} 
                onChange={e => setForm({...form, Fecha_Comentario: e.target.value})} 
              />
              <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={guardar}>
                {enEdicion ? "Actualizar" : "Guardar"}
              </button>
              {enEdicion && (
                <button className="btn btn-secondary w-100 mt-2" onClick={limpiar}>Cancelar</button>
              )}
            </div>
          </div>

          <div className="col-md-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="p-3 border-bottom">
                <input type="text" className="form-control"
                  placeholder=" Buscar por usuario o comentario..."
                  value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              </div>
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Usuario</th>
                    <th>Comentario</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {comentarios.filter(c =>
                    String(c.ID_Usuario || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                    String(c.Comentario || '').toLowerCase().includes(busqueda.toLowerCase())
                  ).map(c => (
                    <tr key={c.Codigo_Comentario}>
                      <td>{c.ID_Usuario}</td>
                      <td>{c.Comentario}</td>
                      <td>{new Date(c.Fecha_Comentario).toLocaleDateString()}</td>
                      <td>
                        {(miRol === 3 || c.ID_Usuario === miUsuario) ? (
                          <>
                            <button 
                              className="btn btn-sm me-1 text-white" 
                              style={{ backgroundColor: '#121212' }} 
                              onClick={() => { setForm(c); setEnEdicion(true); }}
                            >
                              Editar
                            </button>
                            <button 
                              className="btn btn-sm text-white" 
                              style={{ backgroundColor: '#DB0000' }} 
                              onClick={() => eliminar(c.Codigo_Comentario)}
                            >
                              Borrar
                            </button>
                          </>
                        ) : (
                          <span className="badge bg-secondary">Sin permisos</span>
                        )}
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

export default Comentarios;