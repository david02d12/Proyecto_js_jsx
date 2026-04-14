import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chats = ({ cerrarSesion, setVista }) => {
  const [chats, setChats] = useState([]);
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({
    Codigo_Chat: '',
    ID_Usuario: '',
    ID_Servicio: ''
  });

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    listar();
  }, []);

  const listar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/chats/listar', config());
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const guardar = async () => {
    try {
      const url = enEdicion ? 'actualizar' : 'agregar';
      const metodo = enEdicion ? 'put' : 'post';
      
      // En el backend, 'agregar' no requiere Codigo_Chat, pero 'actualizar' sí.
      await axios[metodo](`http://localhost:3000/api/chats/${url}`, form, config());
      
      listar();
      limpiar();
    } catch (err) {
      alert("Error al procesar el chat");
    }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar chat?")) {
      try {
        await axios.delete(`http://localhost:3000/api/chats/eliminar/${id}`, config());
        listar();
      } catch (err) {
        alert("Error al eliminar chat");
      }
    }
  };

  const limpiar = () => {
    setForm({ Codigo_Chat: '', ID_Usuario: '', ID_Servicio: '' });
    setEnEdicion(false);
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm" style={{ backgroundColor: '#DB0000' }}>
        <div className="container">
          <button className="btn fw-bold text-white" style={{ backgroundColor: '#121212' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#menuGlobal">Menú</button>
          <span className="navbar-brand fw-bold ms-3">Gestión de Chats</span>
          <button className="btn btn-sm fw-bold text-white" style={{ backgroundColor: '#121212' }} onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          {/* FORMULARIO */}
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5>{enEdicion ? "Editar Chat" : "Nuevo Chat"}</h5>
              <input 
                className="form-control mb-2" 
                placeholder="Código Chat" 
                value={form.Codigo_Chat} 
                disabled 
                readOnly 
              />
              <input 
                className="form-control mb-2" 
                placeholder="ID Usuario (Email/Username)" 
                value={form.ID_Usuario} 
                onChange={e => setForm({...form, ID_Usuario: e.target.value})} 
              />
              <input 
                className="form-control mb-2" 
                type="number" 
                placeholder="ID Servicio" 
                value={form.ID_Servicio} 
                onChange={e => setForm({...form, ID_Servicio: e.target.value})} 
              />
              <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={guardar}>
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
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Cod</th>
                    <th>ID Usuario</th>
                    <th>ID Servicio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {chats.map(c => (
                    <tr key={c.Codigo_Chat}>
                      <td>{c.Codigo_Chat}</td>
                      <td>{c.ID_Usuario}</td>
                      <td>{c.ID_Servicio}</td>
                      <td>
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
                          onClick={() => eliminar(c.Codigo_Chat)}
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

export default Chats;
