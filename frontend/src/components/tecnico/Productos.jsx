import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import axios from 'axios';

const Productos = ({ cerrarSesion, setVista }) => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [enEdicion, setEnEdicion] = useState(false);
  const [form, setForm] = useState({
    Codigo_Producto: '', Cantidad: '', Precio: '', Nombre: '', 
    Descripcion: '', Imagen: '', Activo_Catalogo: 1, ID_Categoria: ''
  });

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => { listar(); }, []);

  const listar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/productos/listar', config());
      setProductos(res.data);
    } catch (err) { console.error(err); }
  };

  const guardar = async () => {
    try {
      const url = enEdicion ? 'actualizar' : 'agregar';
      const metodo = enEdicion ? 'put' : 'post';
      await axios[metodo](`http://localhost:3000/api/productos/${url}`, form, config());
      listar();
      limpiar();
    } catch (err) { alert("Error al procesar producto"); }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar producto?")) {
      await axios.delete(`http://localhost:3000/api/productos/eliminar/${id}`, config());
      listar();
    }
  };

  const limpiar = () => {
    setForm({ Codigo_Producto: '', Cantidad: '', Precio: '', Nombre: '', Descripcion: '', Imagen: '', Activo_Catalogo: 1, ID_Categoria: '' });
    setEnEdicion(false);
  };

  return (
    <div>
      <Navbar titulo="CELUACCEL — Gestión" cerrarSesion={cerrarSesion} />

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm border-0">
              <h5>{enEdicion ? "Editar Producto" : "Nuevo Producto"}</h5>
              <input className="form-control mb-2" placeholder="Código" value={form.Codigo_Producto} disabled={enEdicion} onChange={e => setForm({...form, Codigo_Producto: e.target.value})} />
              <input className="form-control mb-2" placeholder="Nombre" value={form.Nombre} onChange={e => setForm({...form, Nombre: e.target.value})} />
              <input className="form-control mb-2" type="number" placeholder="Cantidad" value={form.Cantidad} onChange={e => setForm({...form, Cantidad: e.target.value})} />
              <input className="form-control mb-2" type="number" placeholder="Precio" value={form.Precio} onChange={e => setForm({...form, Precio: e.target.value})} />
              <input className="form-control mb-2" placeholder="Descripción" value={form.Descripcion} onChange={e => setForm({...form, Descripcion: e.target.value})} />
              <input className="form-control mb-2" placeholder="URL Imagen" value={form.Imagen} onChange={e => setForm({...form, Imagen: e.target.value})} />
              <input className="form-control mb-2" type="number" placeholder="ID Categoría" value={form.ID_Categoria} onChange={e => setForm({...form, ID_Categoria: e.target.value})} />
              <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#DB0000' }} onClick={guardar}>{enEdicion ? "Actualizar" : "Guardar"}</button>
              {enEdicion && <button className="btn btn-secondary w-100 mt-2" onClick={limpiar}>Cancelar</button>}
            </div>
          </div>
          <div className="col-md-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="p-3 border-bottom">
                <input type="text" className="form-control"
                  placeholder=" Buscar por código, nombre o descripción..."
                  value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              </div>
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr><th>Cod</th><th>Nombre</th><th>Stock</th><th>Precio</th><th>Acciones</th></tr>
                </thead>
                <tbody className="bg-white">
                  {productos.filter(p =>
                    String(p.Codigo_Producto).toLowerCase().includes(busqueda.toLowerCase()) ||
                    String(p.Nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                    String(p.Descripcion || '').toLowerCase().includes(busqueda.toLowerCase())
                  ).map(p => (
                    <tr key={p.Codigo_Producto}>
                      <td>{p.Codigo_Producto}</td>
                      <td>{p.Nombre}</td>
                      <td>{p.Cantidad}</td>
                      <td className="text-success fw-bold">${p.Precio}</td>
                      <td>
                        <button className="btn btn-sm me-1 text-white" style={{ backgroundColor: '#121212' }} onClick={() => { setForm(p); setEnEdicion(true); }}>Editar</button>
                        <button className="btn btn-sm text-white" style={{ backgroundColor: '#DB0000' }} onClick={() => eliminar(p.Codigo_Producto)}>Borrar</button>
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
export default Productos;