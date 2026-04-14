import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comentarios = ({ cerrarSesion, setVista }) => {
  const [comentarios, setComentarios] = useState([]);
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({
    Codigo_Comentario: '',
    ID_Usuario: '',
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
      setComentarios(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const guardar = async () => {
    try {
      const url = enEdicion ? 'actualizar' : 'agregar';
      const metodo = enEdicion ? 'put' : 'post';
      
      // Si es agregar, el backend genera la fecha si va vacía, 
      // pero enviamos el form completo para mantener la lógica.
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
    setForm({ Codigo_Comentario: '', ID_Usuario: '', Comentario: '', Fecha_Comentario: '' });
    setEnEdicion(false);
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm" style={{ backgroundColor: '#DB0000' }}>
        <div className="container">
          <button className="btn fw-bold text-white" style={{ backgroundColor: '#121212' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#menuGlobal">Menú</button>
          <span className="navbar-brand fw-bold ms-3">Gestión de Comentarios</span>
          <button className="btn btn-sm fw-bold text-white" style={{ backgroundColor: '#121212' }} onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          {/* FORMULARIO */}
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5>{enEdicion ? "Editar Comentario" : "Nuevo Comentario"}</h5>
              <input 
                className="form-control mb-2" 
                placeholder="ID Usuario" 
                value={form.ID_Usuario} 
                disabled={enEdicion}
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

          {/* TABLA DE DATOS */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm overflow-hidden">
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
                  {comentarios.map(c => (
                    <tr key={c.Codigo_Comentario}>
                      <td>{c.ID_Usuario}</td>
                      <td>{c.Comentario}</td>
                      <td>{new Date(c.Fecha_Comentario).toLocaleDateString()}</td>
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
                          onClick={() => eliminar(c.Codigo_Comentario)}
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

export default Comentarios;
