import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axios from 'axios';

const Tipo = ({ cerrarSesion, setVista }) => {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({
    Codigo_Documento: '', Nombre_Documento: ''
  });

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => { listar(); }, []);

  const listar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/tipodocumento/listar', config());
      setDatos(res.data);
    } catch (err) { console.error("Error al listar", err); }
  };

  const guardar = async () => {
    try {
      const url = enEdicion ? "actualizar" : "agregar";
      const metodo = enEdicion ? 'put' : 'post';
      await axios[metodo](`http://localhost:3000/api/tipodocumento/${url}`, form, config());
      listar();
      limpiar();
    } catch (err) { alert("Error al procesar la solicitud."); }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      await axios.delete(`http://localhost:3000/api/tipodocumento/eliminar/${id}`, config());
      listar();
    }
  };

  const limpiar = () => {
    setForm({ Codigo_Documento: '', Nombre_Documento: '' });
    setEnEdicion(false);
  };

  return (
    <div>
      <Navbar titulo="CELUACCEL — Gestión" cerrarSesion={cerrarSesion} />

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5 className="mb-3">{enEdicion ? "Editar Documento" : "Nuevo Documento"}</h5>
              <input className="form-control mb-2" type="number" disabled={enEdicion} value={form.Codigo_Documento} placeholder="Código Documento" onChange={e => setForm({...form, Codigo_Documento: e.target.value})} />
              <input className="form-control mb-3" value={form.Nombre_Documento} placeholder="Nombre Documento" onChange={e => setForm({...form, Nombre_Documento: e.target.value})} />
              <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={guardar}>
                {enEdicion ? "Actualizar" : "Guardar Documento"}
              </button>
              {enEdicion && <button className="btn btn-secondary w-100 mt-2" onClick={limpiar}>Cancelar</button>}
            </div>
          </div>
          <div className="col-md-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="p-3 border-bottom">
                <input type="text" className="form-control"
                  placeholder=" Buscar por código o nombre de documento..."
                  value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              </div>
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr><th>Código</th><th>Nombre Documento</th><th>Acciones</th></tr>
                </thead>
                <tbody className="bg-white">
                  {datos.filter(d =>
                    String(d.Codigo_Documento).includes(busqueda) ||
                    String(d.Nombre_Documento || '').toLowerCase().includes(busqueda.toLowerCase())
                  ).map(d => (
                    <tr key={d.Codigo_Documento}>
                      <td className="fw-bold">{d.Codigo_Documento}</td>
                      <td>{d.Nombre_Documento}</td>
                      <td>
                        <button className="btn btn-sm me-1 text-white fw-bold" style={{ backgroundColor: '#121212' }} onClick={() => { setEnEdicion(true); setForm(d); }}>Editar</button>
                        <button className="btn btn-sm text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={() => eliminar(d.Codigo_Documento)}>Borrar</button>
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

export default Tipo;