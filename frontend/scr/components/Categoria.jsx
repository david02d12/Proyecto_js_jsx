import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categorias = ({ setView }) => {
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState({ ID_Categoria: '', Nombre_Categoria: '' });

    // Cargar categorías desde el backend
    const fetchCategorias = async () => {
        try {
            // Asegúrate de tener esta ruta creada en tu Node.js (ex: /categorias)
            const res = await axios.get('http://localhost:3000/categorias');
            setCategorias(res.data);
        } catch (err) {
            console.error("Error al cargar categorías:", err);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const agregarCategoria = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/categorias', nuevaCategoria);
            alert("Categoría agregada");
            setNuevaCategoria({ ID_Categoria: '', Nombre_Categoria: '' });
            fetchCategorias();
        } catch (err) {
            alert("Error al agregar");
        }
    };

    return (
        <div className="container" style={{ width: '100%' }}>
            <h2 style={{ color: 'var(--gold)', textAlign: 'center' }}>Gestión de Categorías</h2>

            {/* Formulario para nuevas categorías */}
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '1px solid #333', marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--gold)' }}>Nueva Categoría</h3>
                <form onSubmit={agregarCategoria} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="number" 
                        placeholder="ID" 
                        value={nuevaCategoria.ID_Categoria} 
                        onChange={(e) => setNuevaCategoria({...nuevaCategoria, ID_Categoria: e.target.value})} 
                        required 
                        style={{ width: '100px' }}
                    />
                    <input 
                        type="text" 
                        placeholder="Nombre de la Categoría" 
                        value={nuevaCategoria.Nombre_Categoria} 
                        onChange={(e) => setNuevaCategoria({...nuevaCategoria, Nombre_Categoria: e.target.value})} 
                        required 
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="gold-button">Agregar</button>
                </form>
            </div>

            {/* Tabla de Categorías */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre de Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map(cat => (
                            <tr key={cat.ID_Categoria}>
                                <td>{cat.ID_Categoria}</td>
                                <td>{cat.Nombre_Categoria}</td>
                                <td>
                                    <button 
                                        onClick={() => {/* Lógica eliminar */}} 
                                        className="btn-delete"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="gold-button" style={{ marginTop: '20px' }} onClick={() => setView('home')}>
                Volver al Inicio
            </button>
        </div>
    );
};

export default Categorias;
