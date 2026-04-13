import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Servicios = ({ cerrarSesion, setVista }) => {
  const [servicios, setServicios] = useState([]); 
  const [busqueda, setBusqueda] = useState('');
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
      <Navbar titulo="CELUACCEL — Control de Reparaciones" cerrarSesion={cerrarSesion} />

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
              <div className="p-3 border-bottom">
                <input type="text" className="form-control"
                  placeholder=" Buscar por descripción, móvil, usuario..."
                  value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              </div>
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr><th>ID</th><th>Descripción</th><th>Móvil</th><th>Precio</th><th>Acciones</th></tr>
                </thead>
                <tbody className="bg-white">
                  {servicios.filter(s =>
                    String(s.Descripcion || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                    String(s.Movil_Nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                    String(s.ID_Usuario || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                    String(s.ID_Servicio).includes(busqueda)
                  ).map(s => (
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

export default Servicios;