import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Usuarios = ({ cerrarSesion, setVista }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({
    ID_Usuario: '',
    Codigo_Documento: '',
    Nombre: '',
    Fecha_Nacimiento: '',
    Direccion: '',
    Telefono: '',
    Correo: '',
    Clave: '',
    Rol: 'Admin'
  });

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    listar();
  }, []);

  const listar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/usuarios/listar', config());
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al listar usuarios:", err);
    }
  };

  const guardar = async () => {
    try {
      // Si estamos editando usamos 'actualizar' (PUT), si es nuevo usamos 'registro' (POST)
      const url = enEdicion ? 'usuarios/actualizar' : 'registro';
      const metodo = enEdicion ? 'put' : 'post';
      
      await axios[metodo](`http://localhost:3000/api/${url}`, form, config());
      
      listar();
      limpiar();
      alert(enEdicion ? "Usuario actualizado" : "Usuario registrado");
    } catch (err) {
      alert("Error al procesar usuario. Verifique los datos o si el ID ya existe.");
    }
  };

  const eliminar = async (id) => {
    if (window.confirm(`¿Está seguro de eliminar al usuario ${id}?`)) {
      try {
        await axios.delete(`http://localhost:3000/api/usuarios/eliminar/${id}`, config());
        listar();
      } catch (err) {
        alert("Error al eliminar usuario");
      }
    }
  };

  const limpiar = () => {
    setForm({
      ID_Usuario: '',
      Codigo_Documento: '',
      Nombre: '',
      Fecha_Nacimiento: '',
      Direccion: '',
      Telefono: '',
      Correo: '',
      Clave: '',
      Rol: 'Admin'
    });
    setEnEdicion(false);
  };

  // Función para cargar datos en el formulario al editar
  const prepararEdicion = (u) => {
    setForm({
      ...u,
      Clave: '' // Dejamos la clave vacía por seguridad al editar
    });
    setEnEdicion(true);
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm" style={{ backgroundColor: '#DB0000' }}>
        <div className="container">
          <button className="btn fw-bold text-white" style={{ backgroundColor: '#121212' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#menuGlobal">Menú</button>
          <span className="navbar-brand fw-bold ms-3">Gestión de Usuarios</span>
          <button className="btn btn-sm fw-bold text-white" style={{ backgroundColor: '#121212' }} onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          {/* FORMULARIO */}
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5 className="fw-bold">{enEdicion ? "Editar Perfil" : "Registrar Usuario"}</h5>
              <hr />
              <div className="row">
                <div className="col-6">
                  <input className="form-control mb-2" placeholder="ID Usuario" value={form.ID_Usuario} disabled={enEdicion} onChange={e => setForm({...form, ID_Usuario: e.target.value})} />
                </div>
                <div className="col-6">
                  <input className="form-control mb-2" type="number" placeholder="Cód. Documento" value={form.Codigo_Documento} onChange={e => setForm({...form, Codigo_Documento: e.target.value})} />
                </div>
              </div>
              <input className="form-control mb-2" placeholder="Nombre Completo" value={form.Nombre} onChange={e => setForm({...form, Nombre: e.target.value})} />
              <input className="form-control mb-2" type="date" title="Fecha de Nacimiento" value={form.Fecha_Nacimiento} onChange={e => setForm({...form, Fecha_Nacimiento: e.target.value})} />
              <input className="form-control mb-2" placeholder="Dirección" value={form.Direccion} onChange={e => setForm({...form, Direccion: e.target.value})} />
              <input className="form-control mb-2" placeholder="Teléfono" value={form.Telefono} onChange={e => setForm({...form, Telefono: e.target.value})} />
              <input className="form-control mb-2" type="email" placeholder="Correo Electrónico" value={form.Correo} onChange={e => setForm({...form, Correo: e.target.value})} />
              <input className="form-control mb-2" type="password" placeholder={enEdicion ? "Nueva Clave (opcional)" : "Contraseña"} value={form.Clave} onChange={e => setForm({...form, Clave: e.target.value})} />
              
              <select className="form-select mb-3" value={form.Rol} onChange={e => setForm({...form, Rol: e.target.value})}>
                <option value="Admin">Administrador</option>
                <option value="Empleado">Empleado</option>
                <option value="Cliente">Cliente</option>
              </select>

              <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={guardar}>
                {enEdicion ? "Actualizar Datos" : "Registrar"}
              </button>
              {enEdicion && <button className="btn btn-secondary w-100 mt-2" onClick={limpiar}>Cancelar</button>}
            </div>
          </div>

          {/* TABLA DE USUARIOS */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>ID / Usuario</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {usuarios.map(u => (
                      <tr key={u.ID_Usuario}>
                        <td className="fw-bold">{u.ID_Usuario}</td>
                        <td>{u.Nombre}</td>
                        <td>{u.Correo}</td>
                        <td><span className="badge bg-dark">{u.Rol}</span></td>
                        <td>
                          <button className="btn btn-sm me-1 text-white" style={{ backgroundColor: '#121212' }} onClick={() => prepararEdicion(u)}>Editar</button>
                          <button className="btn btn-sm text-white" style={{ backgroundColor: '#DB0000' }} onClick={() => eliminar(u.ID_Usuario)}>Borrar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

export default Usuarios;
