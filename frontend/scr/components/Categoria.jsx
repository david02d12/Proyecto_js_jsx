import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categorias = ({ cerrarSesion, setVista }) => {
  const [categorias, setCategorias] = useState([]);
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({ ID_Categoria: '', Nombre_Categoria: '' });

  const config = () => ({ headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });

  useEffect(() => { listar(); }, []);

  const listar = async () => {
    const res = await axios.get('http://localhost:3000/api/categorias/listar', config());
    setCategorias(res.data);
  };

  const guardar = async () => {
    const url = enEdicion ? 'actualizar' : 'agregar';
    const metodo = enEdicion ? 'put' : 'post';
    await axios[metodo](`http://localhost:3000/api/categorias/${url}`, form, config());
    listar();
    limpiar();
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar categoría?")) {
      await axios.delete(`http://localhost:3000/api/categorias/eliminar/${id}`, config());
      listar();
    }
  };

  const limpiar = () => { setForm({ ID_Categoria: '', Nombre_Categoria: '' }); setEnEdicion(false); };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm" style={{ backgroundColor: '#DB0000' }}>
        <div className="container">
          <button className="btn fw-bold text-white" style={{ backgroundColor: '#121212' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#menuGlobal">Menú</button>
          <span className="navbar-brand fw-bold ms-3">Categorías</span>
          <button className="btn btn-sm fw-bold text-white" style={{ backgroundColor: '#121212' }} onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5>{enEdicion ? "Editar Categoría" : "Nueva Categoría"}</h5>
              <input className="form-control mb-2" type="number" placeholder="ID Categoría" value={form.ID_Categoria} disabled={enEdicion} onChange={e => setForm({...form, ID_Categoria: e.target.value})} />
              <input className="form-control mb-2" placeholder="Nombre Categoría" value={form.Nombre_Categoria} onChange={e => setForm({...form, Nombre_Categoria: e.target.value})} />
              <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={guardar}>{enEdicion ? "Actualizar" : "Guardar"}</button>
              {enEdicion && <button className="btn btn-secondary w-100 mt-2" onClick={limpiar}>Cancelar</button>}
            </div>
          </div>
          <div className="col-md-8">
            <table className="table table-hover shadow-sm bg-white">
              <thead className="table-dark"><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
              <tbody>
                {categorias.map(c => (
                  <tr key={c.ID_Categoria}>
                    <td>{c.ID_Categoria}</td>
                    <td>{c.Nombre_Categoria}</td>
                    <td>
                      <button className="btn btn-sm me-1 text-white" style={{ backgroundColor: '#121212' }} onClick={() => { setForm(c); setEnEdicion(true); }}>Editar</button>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: '#DB0000' }} onClick={() => eliminar(c.ID_Categoria)}>Borrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/*MENU DEL LADO*/}
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
export default Categorias;
