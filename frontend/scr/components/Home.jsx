import React, { useState } from 'react';

const Home = ({ setView }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false); 

  const fetchProductos = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:3000/productos');
      
      if (!response.ok) throw new Error("Error en el servidor");

      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      alert("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container" style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: 'var(--gold)' }}>Panel de Inventario - CeluAccel</h1>
      <p>Gestión de catálogo y stock en tiempo real.</p>
      
      <div style={{ marginBottom: '30px' }}>
        <button 
          className="gold-button" 
          onClick={fetchProductos} 
          disabled={cargando}
        >
          {cargando ? "Cargando..." : "Cargar Catálogo de Productos"}
        </button>
      </div>

      {productos.length > 0 ? (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gold)', color: 'var(--gold)' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id_Producto} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '10px' }}>{prod.id_Producto}</td>
                  <td>{prod.Nombre}</td>
                  <td style={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('es-CO', { 
                      style: 'currency', 
                      currency: 'COP', 
                      maximumFractionDigits: 0 
                    }).format(prod.Precio)}
                  </td>
                  <td>{prod.Cantidad}</td>
                  <td>{prod.ID_Categoria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !cargando && <p style={{ color: '#666', marginTop: '20px' }}>El catálogo está vacío o no se ha cargado.</p>
      )}

      <hr style={{ borderColor: '#333', margin: '40px 0' }} />

      <button 
        className="gold-button" 
        style={{ marginTop: '20px', backgroundColor: 'transparent', border: '1px solid #666', color: '#999', cursor: 'pointer' }} 
        onClick={() => setView('login')}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Home;
