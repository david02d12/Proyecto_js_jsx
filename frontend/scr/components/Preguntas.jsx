import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Preguntas = ({ cerrarSesion, setVista }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({ ID_Consulta: '', ID_Usuario: '', Codigo_Producto: '', Pregunta: '', Fecha: '' });

  const config = () => ({ headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });

  useEffect(() => { listar(); }, []);

  const listar = async () => {
    const res = await axios.get('http://localhost:3000/api/preguntas/listar', config());
    setPreguntas(res.data);
  };

  const guardar = async () => {
    const url = enEdicion ? 'actualizar' : 'agregar';
    const metodo = enEdicion ? 'put' : 'post';
    await axios[metodo](`http://localhost:3000/api/preguntas/${url}`, form, config());
    listar();
    limpiar();
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar pregunta?")) {
      await axios.delete(`http://localhost:3000/api/preguntas/eliminar/${id}`, config());
      listar();
    }
  };

  const limpiar = () => { setForm({ ID_Consulta: '', ID_Usuario: '', Codigo_Producto: '', Pregunta: '', Fecha: '' }); setEnEdicion(false); };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm" style={{ backgroundColor: '#DB0000' }}>
        <div className="container">
          <button className="btn fw-bold text-white" style={{ backgroundColor: '#121212' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#menuGlobal">Menú</button>
          <span className="navbar-brand fw-bold ms-3">Consultas de Usuarios</span>
          <button className="btn btn-sm fw-bold text-white" style={{ backgroundColor: '#121212' }} onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5>{enEdicion ? "Editar Consulta" : "Nueva Consulta"}</h5>
              <input className="form-control mb-2" type="number" placeholder="ID Consulta" value={form.ID_Consulta} disabled={enEdicion} onChange={e => setForm({...form, ID_Consulta: e.target.value})} />
              <input className="form-control mb-2" placeholder="ID Usuario" value={form.ID_Usuario} onChange={e => setForm({...form, ID_Usuario: e.target.value})} />
              <input className="form-control mb-2" placeholder="Cód. Producto" value={form.Codigo_Producto} onChange={e => setForm({...form, Codigo_Producto: e.target.value})} />
              <textarea className="form-control mb-2" placeholder="Pregunta" value={form.Pregunta} onChange={e => setForm({...form, Pregunta: e.target.value})} />
              <input className="form-control mb-2" type="date" value={form.Fecha} onChange={e => setForm({...form, Fecha: e.target.value})} />
              <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={guardar}>{enEdicion ? "Actualizar" : "Guardar"}</button>
              {enEdicion && <button className="btn btn-secondary w-100 mt-2" onClick={limpiar}>Cancelar</button>}
            </div>
          </div>
          <div className="col-md-8">
            <table className="table table-hover shadow-sm bg-white">
              <thead className="table-dark"><tr><th>ID</th><th>Usuario</th><th>Prod</th><th>Pregunta</th><th>Acciones</th></tr></thead>
              <tbody>
                {preguntas.map(p => (
                  <tr key={p.ID_Consulta}>
                    <td>{p.ID_Consulta}</td>
                    <td>{p.ID_Usuario}</td>
                    <td>{p.Codigo_Producto}</td>
                    <td>{p.Pregunta}</td>
                    <td>
                      <button className="btn btn-sm me-1 text-white" style={{ backgroundColor: '#121212' }} onClick={() => { setForm({...p, Fecha: p.Fecha.split('T')[0]}); setEnEdicion(true); }}>Editar</button>
                      <button className="btn btn-sm text-white" style={{ backgroundColor: '#DB0000' }} onClick={() => eliminar(p.ID_Consulta)}>Borrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
export default Preguntas;
