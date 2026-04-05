import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Historial = ({ cerrarSesion, setVista }) => {
  const [datos, setDatos] = useState([]);
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({
    ID_Historial: '', ID_Servicio: '', Fecha_Evento: '', Descripcion_Evento: '', Estado: ''
  });

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => { listar(); }, []);

  const listar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/historial/listar', config());
      setDatos(res.data);
    } catch (err) { console.error("Error al listar", err); }
  };

  const guardar = async () => {
    try {
      const url = enEdicion ? "actualizar" : "agregar";
      const metodo = enEdicion ? 'put' : 'post';
      await axios[metodo](`http://localhost:3000/api/historial/${url}`, form, config());
      listar();
      limpiar();
    } catch (err) { alert("Error al procesar la solicitud."); }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      await axios.delete(`http://localhost:3000/api/historial/eliminar/${id}`, config());
      listar();
    }
  };

  const limpiar = () => {
    setForm({ ID_Historial: '', ID_Servicio: '', Fecha_Evento: '', Descripcion_Evento: '', Estado: '' });
    setEnEdicion(false);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm" style={{ backgroundColor: '#DB0000' }}>
        <div className="container">
          <button className="btn fw-bold text-white" style={{ backgroundColor: '#121212' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#menuGlobal">
            MENÚ
          </button>
          <span className="navbar-brand fw-bold">CELUACCEL Gestion de Historial</span>
          <button className="btn btn-sm fw-bold text-white ms-3" style={{ backgroundColor: '#121212' }} onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5 className="mb-3">{enEdicion ? "Editar Evento" : "Nuevo Evento"}</h5>
              <input className="form-control mb-2" disabled={enEdicion} value={form.ID_Historial} placeholder="ID Historial" onChange={e => setForm({...form, ID_Historial: e.target.value})} />
              <input className="form-control mb-2" type="number" value={form.ID_Servicio} placeholder="ID Servicio" onChange={e => setForm({...form, ID_Servicio: e.target.value})} />
              <input className="form-control mb-2" type="date" value={form.Fecha_Evento} onChange={e => setForm({...form, Fecha_Evento: e.target.value})} />
              <input className="form-control mb-2" value={form.Descripcion_Evento} placeholder="Descripción Evento" onChange={e => setForm({...form, Descripcion_Evento: e.target.value})} />
              <input className="form-control mb-3" value={form.Estado} placeholder="Estado" onChange={e => setForm({...form, Estado: e.target.value})} />
              <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={guardar}>
                {enEdicion ? "Actualizar" : "Guardar Evento"}
              </button>
              {enEdicion && <button className="btn btn-secondary w-100 mt-2" onClick={limpiar}>Cancelar</button>}
            </div>
          </div>
          <div className="col-md-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr><th>ID Historial</th><th>Servicio</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody className="bg-white">
                  {datos.map(d => (
                    <tr key={d.ID_Historial}>
                      <td className="fw-bold">{d.ID_Historial}</td>
                      <td>{d.ID_Servicio}</td>
                      <td>{d.Fecha_Evento ? d.Fecha_Evento.split('T')[0] : ''}</td>
                      <td>{d.Estado}</td>
                      <td>
                        <button className="btn btn-sm me-1 text-white fw-bold" style={{ backgroundColor: '#121212' }} onClick={() => { setEnEdicion(true); setForm({...d, Fecha_Evento: d.Fecha_Evento ? d.Fecha_Evento.split('T')[0] : ''}); }}>Editar</button>
                        <button className="btn btn-sm text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={() => eliminar(d.ID_Historial)}>Borrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="offcanvas offcanvas-start text-white" tabindex="-1" id="menuGlobal" style={{ backgroundColor: '#121212' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menú de Navegación</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <div className="d-grid gap-3">
            <button className="btn text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('roles')}>Roles de Usuario</button>
            <button className="btn text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('historial')}>Historial de Servicios</button>
            <button className="btn text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('tipo')}>Tipos de Documento</button>
            <button className="btn text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={() => setVista('servicios')}>Gestión de Servicios</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;