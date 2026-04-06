import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Listar = ({ setView }) => {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [editando, setEditando] = useState(null);
    const [nuevoProducto, setNuevoProducto] = useState({
        id_Producto: '', Cantidad: '', Precio: '', Nombre: '', Descripcion: '', ID_Categoria: 1, Activo_Catalogo: 1
    });

    const fetchProductos = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/productos?nombre=${busqueda}`);
            setProductos(res.data);
        } catch (err) {
            console.error("Error al cargar:", err);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, [busqueda]);

    const agregarProducto = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/productos', nuevoProducto);
            alert("Producto agregado");
            setNuevoProducto({ id_Producto: '', Cantidad: '', Precio: '', Nombre: '', Descripcion: '', ID_Categoria: 1, Activo_Catalogo: 1 });
            fetchProductos();
        } catch (err) {
            alert("Error al agregar");
        }
    };

    const guardarEdicion = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/productos/${editando.id_Producto}`, editando);
            alert("Producto actualizado");
            setEditando(null);
            fetchProductos();
        } catch (err) {
            alert("Error al editar");
        }
    };

    const eliminar = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
            try {
                await axios.delete(`http://localhost:3000/productos/${id}`);
                fetchProductos();
            } catch (err) {
                alert("Error al eliminar");
            }
        }
    };

    return (
        <div className="container" style={{ maxWidth: '1100px', color: 'white' }}>
            <h2 style={{ color: 'var(--gold)', textAlign: 'center' }}>Gestión de Inventario CeluAccel</h2>

            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Buscar producto por nombre..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid var(--gold)', background: '#222', color: 'white' }}
                />
            </div>

            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '1px solid #333', marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--gold)' }}>{editando ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <form onSubmit={editando ? guardarEdicion : agregarProducto} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" placeholder="ID Producto" value={editando ? editando.id_Producto : nuevoProducto.id_Producto} onChange={(e) => editando ? setEditando({...editando, id_Producto: e.target.value}) : setNuevoProducto({...nuevoProducto, id_Producto: e.target.value})} required disabled={!!editando} />
                    <input type="text" placeholder="Nombre" value={editando ? editando.Nombre : nuevoProducto.Nombre} onChange={(e) => editando ? setEditando({...editando, Nombre: e.target.value}) : setNuevoProducto({...nuevoProducto, Nombre: e.target.value})} required />
                    <input type="number" placeholder="Precio" value={editando ? editando.Precio : nuevoProducto.Precio} onChange={(e) => editando ? setEditando({...editando, Precio: e.target.value}) : setNuevoProducto({...nuevoProducto, Precio: e.target.value})} required />
                    <input type="number" placeholder="Cantidad" value={editando ? editando.Cantidad : nuevoProducto.Cantidad} onChange={(e) => editando ? setEditando({...editando, Cantidad: e.target.value}) : setNuevoProducto({...nuevoProducto, Cantidad: e.target.value})} required />
                    <textarea placeholder="Descripción" value={editando ? editando.Descripcion : nuevoProducto.Descripcion} onChange={(e) => editando ? setEditando({...editando, Descripcion: e.target.value}) : setNuevoProducto({...nuevoProducto, Descripcion: e.target.value})} style={{ gridColumn: 'span 2' }} />
                    <button type="submit" className="gold-button" style={{ gridColumn: 'span 2' }}>{editando ? 'Guardar Cambios' : 'Registrar Producto'}</button>
                    {editando && <button type="button" onClick={() => setEditando(null)} style={{ gridColumn: 'span 2', background: '#444', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>Cancelar Edición</button>}
                </form>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(p => (
                            <tr key={p.id_Producto}>
                                <td>{p.id_Producto}</td>
                                <td>{p.Nombre}</td>
                                <td>${p.Precio}</td>
                                <td>{p.Cantidad}</td>
                                <td>
                                    <button onClick={() => setEditando(p)} style={{ marginRight: '10px', background: '#4a90e2', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                                    <button onClick={() => eliminar(p.id_Producto)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="gold-button" style={{ marginTop: '20px' }} onClick={() => setView('home')}>Volver</button>
        </div>
    );
};

export default Listar;
