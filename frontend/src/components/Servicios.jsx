import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Servicios = ({ cerrarSesion, setVista }) => {
  const [servicios, setServicios] = useState([]); 
  const [enEdicion, setEnEdicion] = useState(false); 
  const [idServicioSel, setIdServicioSel] = useState(null);
  const [formServicio, setFormServicio] = useState({
    Descripcion: '', ID_Usuario: '', Precio: '', Movil_Nombre: '', 
    Movil_Especificacion: '', Fecha: '', Etapa: ''
  });

  const config = () => ({ 
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
  });

  useEffect(() => { listar(); }, []);

  const listar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/servicios/listar', config());
      setServicios(res.data);
    } catch (err) { console.error("Error al listar", err); }
  };

  const guardarServicio = async () => {
    try {
      const url = enEdicion ? "actualizar" : "agregar";
      const metodo = enEdicion ? 'put' : 'post';
      const data = enEdicion ? { ...formServicio, ID_Servicio: idServicioSel } : formServicio;
      await axios[metodo](`http://localhost:3000/api/servicios/${url}`, data, config());
      listar();
      limpiarServicio();
    } catch (err) { alert("Error al procesar la solicitud."); }
  };

  const eliminarServicio = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      await axios.delete(`http://localhost:3000/api/servicios/eliminar/${id}`, config());
      listar();
    }
  };

  const limpiarServicio = () => {
    setFormServicio({ Descripcion: '', ID_Usuario: '', Precio: '', Movil_Nombre: '', Movil_Especificacion: '', Fecha: '', Etapa: '' });
    setEnEdicion(false);
    setIdServicioSel(null);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm" style={{ backgroundColor: '#DB0000' }}>
        <div className="container">
           <button className="btn fw-bold text-white" style={{ backgroundColor: '#121212' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#menuGlobal" aria-controls="menuGlobal">
            Menú
           </button>
          <span className="navbar-brand fw-bold">CELUACCEL Gestión de Servicios</span>
          <div className="d-flex gap-2">
            <button className="btn btn-sm fw-bold text-white ms-3" style={{ backgroundColor: '#121212' }} onClick={cerrarSesion}>Cerrar Sesión</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5 className="mb-3">{enEdicion ? "Editar Servicio" : "Nuevo Registro"}</h5>
              <input className="form-control mb-2" value={formServicio.Descripcion} placeholder="Descripción" onChange={e => setFormServicio({...formServicio, Descripcion: e.target.value})} />
              <input className="form-control mb-2" value={formServicio.ID_Usuario} placeholder="Documento cliente" onChange={e => setFormServicio({...formServicio, ID_Usuario: e.target.value})} />
              <input className="form-control mb-2" type="number" value={formServicio.Precio} placeholder="Precio ($)" onChange={e => setFormServicio({...formServicio, Precio: e.target.value})} />
              <input className="form-control mb-2" value={formServicio.Movil_Nombre} placeholder="Nombre Móvil" onChange={e => setFormServicio({...formServicio, Movil_Nombre: e.target.value})} />
              <input className="form-control mb-2" value={formServicio.Movil_Especificacion} placeholder="Especificación" onChange={e => setFormServicio({...formServicio, Movil_Especificacion: e.target.value})} />
              <input className="form-control mb-2" type="date" value={formServicio.Fecha} onChange={e => setFormServicio({...formServicio, Fecha: e.target.value})} />
              <input className="form-control mb-3" type="number" value={formServicio.Etapa} placeholder="Etapa (1-100)" onChange={e => setFormServicio({...formServicio, Etapa: e.target.value})} />
              <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={guardarServicio}>
                {enEdicion ? "Actualizar" : "Guardar Servicio"}
              </button>
              {enEdicion && <button className="btn btn-secondary w-100 mt-2" onClick={limpiarServicio}>Cancelar</button>}
            </div>
          </div>

          <div className="col-md-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr><th>ID</th><th>Descripción</th><th>Móvil</th><th>Precio</th><th>Acciones</th></tr>
                </thead>
                <tbody className="bg-white">
                  {servicios.map(s => (
                    <tr key={s.ID_Servicio}>
                      <td className="fw-bold">{s.ID_Servicio}</td>
                      <td>{s.Descripcion}</td>
                      <td>{s.Movil_Nombre}</td>
                      <td className="text-success fw-bold">${s.Precio}</td>
                      <td>
                        <button className="btn btn-sm me-1 text-white fw-bold" style={{ backgroundColor: '#121212' }} onClick={() => { 
                          setEnEdicion(true); 
                          setIdServicioSel(s.ID_Servicio); 
                          setFormServicio({...s, Fecha: s.Fecha ? s.Fecha.split('T')[0] : ''}); 
                        }}>Editar</button>
                        <button className="btn btn-sm text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={() => eliminarServicio(s.ID_Servicio)}>Borrar</button>
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

export default Servicios;