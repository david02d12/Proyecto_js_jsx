import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import axios from 'axios';

const Usuarios = ({ cerrarSesion, setVista }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
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
    Codigo_Rol: 2
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
      Codigo_Rol: 2
    });
    setEnEdicion(false);
  };

  const prepararEdicion = (u) => {
    setForm({
      ...u,
      Clave: '' // Dejamos la clave vacía por seguridad al editar
    });
    setEnEdicion(true);
  };

  const nombreRol = (codigo) => {
    if (codigo === 1) return 'Técnico';
    if (codigo === 2) return 'Cliente';
    if (codigo === 3) return 'Administrador';
    return `Rol ${codigo}`;
  };

  return (
    <div>
      {/* NAVBAR */}
      <Navbar titulo="CELUACCEL — Gestión" cerrarSesion={cerrarSesion} />

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
              
              <select className="form-select mb-3" value={form.Codigo_Rol} onChange={e => setForm({...form, Codigo_Rol: Number(e.target.value)})}>
                <option value={1}>Técnico</option>
                <option value={2}>Cliente</option>
                <option value={3}>Administrador</option>
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
              <div className="p-3 border-bottom">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" Buscar por ID, nombre, correo o rol..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                />
              </div>
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
                     {usuarios.filter(u =>
                      String(u.ID_Usuario).toLowerCase().includes(busqueda.toLowerCase()) ||
                      String(u.Nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                      String(u.Correo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                      String(u.Codigo_Rol || '').includes(busqueda)
                    ).map(u => (
                      <tr key={u.ID_Usuario}>
                        <td className="fw-bold">{u.ID_Usuario}</td>
                        <td>{u.Nombre}</td>
                        <td>{u.Correo}</td>
                        <td>
                          <span className="badge" style={{ backgroundColor:
                            u.Codigo_Rol === 1 ? '#0d6efd' :
                            u.Codigo_Rol === 3 ? '#DC3545' : '#121212'
                          }}>
                            {nombreRol(u.Codigo_Rol)}
                          </span>
                        </td>
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

export default Usuarios;