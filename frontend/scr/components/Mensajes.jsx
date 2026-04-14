import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mensajes = ({ cerrarSesion, setVista }) => {
  const [mensajes, setMensajes] = useState([]);
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({
    Codigo_Mensaje: '',
    Codigo_Chat: '',
    ID_Usuario: '',
    Fecha_Mensaje: '',
    Mensaje: '',
    Estado: 0
  });

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    listar();
  }, []);

  const listar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/mensajes/listar', config());
      setMensajes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const guardar = async () => {
    try {
      const url = enEdicion ? 'actualizar' : 'agregar';
      const metodo = enEdicion ? 'put' : 'post';
      
      await axios[metodo](`http://localhost:3000/api/mensajes/${url}`, form, config());
      
      listar();
      limpiar();
    } catch (err) {
      alert("Error al procesar el mensaje");
    }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar este mensaje?")) {
      try {
        await axios.delete(`http://localhost:3000/api/mensajes/eliminar/${id}`, config());
        listar();
      } catch (err) {
        alert("Error al eliminar el mensaje");
      }
    }
  };

  const limpiar = () => {
    setForm({ 
      Codigo_Mensaje: '', 
      Codigo_Chat: '', 
      ID_Usuario: '', 
      Fecha_Mensaje: '', 
      Mensaje: '', 
      Estado: 0 
    });
    setEnEdicion(false);
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm" style={{ backgroundColor: '#DB0000' }}>
        <div className="container">
          <button className="btn fw-bold text-white" style={{ backgroundColor: '#121212' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#menuGlobal">Menú</button>
          <span className="navbar-brand fw-bold ms-3">Gestión de Mensajes</span>
          <button className="btn btn-sm fw-bold text-white" style={{ backgroundColor: '#121212' }} onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          {/* FORMULARIO */}
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5>{enEdicion ? "Editar Mensaje" : "Nuevo Mensaje"}</h5>
              <input 
                className="form-control mb-2" 
                type="number"
                placeholder="Código Chat" 
                value={form.Codigo_Chat} 
                onChange={e => setForm({...form, Codigo_Chat: e.target.value})} 
              />
              <input 
                className="form-control mb-2" 
                placeholder="ID Usuario" 
                value={form.ID_Usuario} 
                onChange={e => setForm({...form, ID_Usuario: e.target.value})} 
              />
              <textarea 
                className="form-control mb-2" 
                placeholder="Escribe el mensaje..." 
                value={form.Mensaje} 
                onChange={e => setForm({...form, Mensaje: e.target.value})}
                rows="3"
              />
              <input 
                className="form-control mb-2" 
                type="date" 
                value={form.Fecha_Mensaje} 
                onChange={e => setForm({...form, Fecha_Mensaje: e.target.value})} 
              />
              <select 
                className="form-select mb-2" 
                value={form.Estado} 
                onChange={e => setForm({...form, Estado: e.target.value})}
              >
                <option value="0">No leído (0)</option>
                <option value="1">Leído (1)</option>
              </select>
              
              <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={guardar}>
                {enEdicion ? "Actualizar" : "Enviar"}
              </button>
              {enEdicion && (
                <button className="btn btn-secondary w-100 mt-2" onClick={limpiar}>Cancelar</button>
              )}
            </div>
          </div>

          {/* TABLA DE DATOS */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Chat</th>
                    <th>Usuario</th>
                    <th>Mensaje</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {mensajes.map(m => (
                    <tr key={m.Codigo_Mensaje}>
                      <td>{m.Codigo_Chat}</td>
                      <td>{m.ID_Usuario}</td>
                      <td className="small">{m.Mensaje}</td>
                      <td>
                        <span className={`badge ${m.Estado === 1 ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {m.Estado === 1 ? 'Leído' : 'Pendiente'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm me-1 text-white" 
                          style={{ backgroundColor: '#121212' }} 
                          onClick={() => { setForm(m); setEnEdicion(true); }}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm text-white" 
                          style={{ backgroundColor: '#DB0000' }} 
                          onClick={() => eliminar(m.Codigo_Mensaje)}
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
{/* MENU DEL LADO */}
<div className="offcanvas offcanvas-start text-white" tabIndex="-1" id="menuGlobal" style={{ backgroundColor: '#121212' }}>
  <div className="offcanvas-header">
    <h5 className="offcanvas-title fw-bold">Menú de Navegación</h5>
    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
  </div>
  <div className="offcanvas-body">
    <div className="d-grid gap-3">
      {/* Administración de Usuarios */}
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('usuarios')} data-bs-dismiss="offcanvas">👥 Gestión de Usuarios</button>
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('roles')} data-bs-dismiss="offcanvas">🔑 Roles de Usuario</button>
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('tipo')} data-bs-dismiss="offcanvas">📄 Tipos de Documento</button>
      
      <hr className="border-secondary" />

      {/* Inventario */}
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('productos')} data-bs-dismiss="offcanvas">📦 Gestión de Productos</button>
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('categorias')} data-bs-dismiss="offcanvas">📁 Categorías de Productos</button>
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('preguntas')} data-bs-dismiss="offcanvas">❓ Preguntas de Productos</button>

      <hr className="border-secondary" />

      {/* Servicios y Soporte */}
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('servicios')} data-bs-dismiss="offcanvas">🛠️ Gestión de Servicios</button>
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('historial')} data-bs-dismiss="offcanvas">📜 Historial de Servicios</button>
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('chats')} data-bs-dismiss="offcanvas">💬 Gestión de Chats</button>
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('mensajes')} data-bs-dismiss="offcanvas">📨 Gestión de Mensajes</button>

      <hr className="border-secondary" />

      {/* Interacción y Sistema */}
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('comentarios')} data-bs-dismiss="offcanvas">⭐ Comentarios</button>
      <button className="btn text-white fw-bold text-start" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('notificaciones')} data-bs-dismiss="offcanvas">🔔 Notificaciones</button>
    </div>
  </div>
</div>
    </div>
  );
};

export default Mensajes;
