import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

// ─── VISTA CLIENTE ─────────────────────────────────────────────────────────────
function CatalogoCliente({ token }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCat, setFiltroCat] = useState('todas');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [pregunta, setPregunta] = useState('');
  const [preguntaEnviada, setPreguntaEnviada] = useState(false);
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const cargar = async () => {
      try {
        const [rProd, rCat] = await Promise.all([
          axios.get(`${API}/api/productos/catalogo`, cfg),
          axios.get(`${API}/api/categorias`, cfg)
        ]);
        setProductos(rProd.data);
        setCategorias(rCat.data);
      } catch (e) { console.error(e); }
    };
    cargar();
  }, []);

  const enviarPregunta = async () => {
    if (!pregunta.trim()) return;
    try {
      await axios.post(`${API}/api/preguntas/hacer`, {
        Codigo_Producto: productoSeleccionado.Codigo_Producto,
        Pregunta: pregunta
      }, cfg);
      setPreguntaEnviada(true);
      setPregunta('');
      setTimeout(() => setPreguntaEnviada(false), 3000);
    } catch (e) { alert('Error al enviar la pregunta.'); }
  };

  const filtrados = productos.filter(p => {
    const matchBusqueda = p.Nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.Descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = filtroCat === 'todas' || p.ID_Categoria === Number(filtroCat);
    return matchBusqueda && matchCat;
  });

  return (
    <div className="catalogo-container">
      <div className="page-header">
        <div className="rol-banner cliente-banner">
          <span className="rol-icono">🛍️</span>
          <div>
            <h2 className="section-title">Catálogo Celuaccel</h2>
            <p className="section-sub">Encuentra repuestos y accesorios de la mejor calidad</p>
          </div>
        </div>
      </div>

      <div className="catalogo-filtros">
        <input
          className="search-input"
          placeholder="🔍 Buscar productos..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <div className="cat-tabs">
          <button className={`filtro-btn ${filtroCat === 'todas' ? 'activo' : ''}`} onClick={() => setFiltroCat('todas')}>
            Todas
          </button>
          {categorias.map(c => (
            <button key={c.ID_Categoria} className={`filtro-btn ${filtroCat === c.ID_Categoria ? 'activo' : ''}`} onClick={() => setFiltroCat(c.ID_Categoria)}>
              {c.Nombre_Categoria}
            </button>
          ))}
        </div>
      </div>

      <div className="productos-grid">
        {filtrados.length === 0 ? (
          <div className="empty-state full-span">
            <span>📦</span>
            <p>No se encontraron productos</p>
          </div>
        ) : filtrados.map(p => (
          <div key={p.Codigo_Producto} className="producto-card" onClick={() => setProductoSeleccionado(p)}>
            <div className="producto-img-placeholder">
              {p.Nombre.charAt(0).toUpperCase()}
            </div>
            <div className="producto-cat-tag">{p.Nombre_Categoria}</div>
            <div className="producto-nombre">{p.Nombre}</div>
            <div className="producto-desc">{p.Descripcion}</div>
            <div className="producto-footer">
              <span className="producto-precio">${Number(p.Precio).toLocaleString('es-CO')}</span>
              <span className="producto-stock">{p.Cantidad} disp.</span>
            </div>
            <div className="producto-preguntar-hint">Ver detalles o preguntar →</div>
          </div>
        ))}
      </div>

      {productoSeleccionado && (
        <div className="modal-overlay" onClick={() => setProductoSeleccionado(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{productoSeleccionado.Nombre}</h3>
              <button className="modal-close" onClick={() => setProductoSeleccionado(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="producto-modal-img">📦</div>
              <div className="detalle-grid">
                <div className="detalle-item"><span>Categoría</span><strong>{productoSeleccionado.Nombre_Categoria}</strong></div>
                <div className="detalle-item"><span>Precio</span><strong className="precio-verde">${Number(productoSeleccionado.Precio).toLocaleString('es-CO')}</strong></div>
                <div className="detalle-item" style={{ gridColumn: '1 / -1' }}><span>Descripción</span><strong>{productoSeleccionado.Descripcion}</strong></div>
                <div className="detalle-item"><span>Disponibilidad</span><strong>{productoSeleccionado.Cantidad} unidades</strong></div>
              </div>

              <div className="pregunta-section">
                <h4>¿Tienes dudas sobre este producto?</h4>
                <p>Nuestros técnicos están listos para asesorarte.</p>
                {preguntaEnviada ? (
                  <div className="alert-ok">✅ Tu pregunta ha sido enviada al equipo técnico. Te responderemos pronto.</div>
                ) : (
                  <>
                    <textarea
                      className="pregunta-input"
                      placeholder="Escribe tu pregunta aquí..."
                      rows="3"
                      value={pregunta}
                      onChange={e => setPregunta(e.target.value)}
                    />
                    <button className="btn-primary w-full" onClick={enviarPregunta}>Enviar Pregunta</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VISTA ADMINISTRADOR (CRUD + Preguntas) ────────────────────────────────────
function CatalogoAdmin({ token, rol }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState({ Codigo_Producto: '', Nombre: '', Descripcion: '', Precio: '', Cantidad: '', ID_Categoria: '', Activo_Catalogo: 1 });
  const [editando, setEditando] = useState(false);
  const cfg = { headers: { Authorization: `Bearer ${token}` } };
  const esTecnico = rol === 1; // El técnico solo ve inventario, el admin hace CRUD

  const cargarDatos = async () => {
    try {
      const [rProd, rCat, rPreg] = await Promise.all([
        axios.get(`${API}/api/productos/listar`, cfg),
        axios.get(`${API}/api/categorias`, cfg),
        axios.get(`${API}/api/preguntas/listar`, cfg)
      ]);
      setProductos(rProd.data);
      setCategorias(rCat.data);
      setPreguntas(rPreg.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const guardar = async () => {
    if (!form.Codigo_Producto || !form.Nombre || !form.Precio || !form.Cantidad || !form.ID_Categoria) {
      alert('Completa los campos obligatorios'); return;
    }
    try {
      if (editando) await axios.put(`${API}/api/productos/actualizar`, form, cfg);
      else await axios.post(`${API}/api/productos/agregar`, form, cfg);
      cargarDatos();
      limpiar();
    } catch (e) { alert('Error al guardar. Verifica que el código no esté duplicado.'); }
  };

  const eliminar = async (cod) => {
    if (!window.confirm('¿Eliminar este producto del sistema?')) return;
    try {
      await axios.delete(`${API}/api/productos/eliminar/${cod}`, cfg);
      cargarDatos();
    } catch (e) { alert('Error al eliminar'); }
  };

  const toggleEstado = async (prod) => {
    try {
      await axios.put(`${API}/api/productos/actualizar`, { ...prod, Activo_Catalogo: prod.Activo_Catalogo ? 0 : 1 }, cfg);
      cargarDatos();
    } catch (e) { alert('Error al cambiar estado'); }
  };

  const limpiar = () => {
    setForm({ Codigo_Producto: '', Nombre: '', Descripcion: '', Precio: '', Cantidad: '', ID_Categoria: '', Activo_Catalogo: 1 });
    setEditando(false);
  };

  const filtrados = productos.filter(p => p.Nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.Codigo_Producto.includes(busqueda));

  return (
    <div className="catalogo-container">
      <div className="page-header">
        <div className={`rol-banner ${esTecnico ? 'tecnico-banner' : 'admin-banner'}`}>
          <span className="rol-icono">{esTecnico ? '📦' : '⚙️'}</span>
          <div>
            <h2 className="section-title">Gestión de Inventario</h2>
            <p className="section-sub">{esTecnico ? 'Consulta de stock' : 'CRUD completo y visibilidad en tienda'}</p>
          </div>
        </div>
      </div>

      <div className="servicios-layout">
        <main className="table-panel">
          <div className="toolbar">
            <input className="search-input" placeholder="🔍 Buscar código o nombre..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            <button className="btn-outline" onClick={cargarDatos}>↻ Actualizar</button>
          </div>

          <div className="productos-tabla">
            {filtrados.map(p => (
              <div key={p.Codigo_Producto} className={`producto-fila ${p.Activo_Catalogo ? '' : 'producto-inactivo'}`}>
                <div className="producto-fila-info">
                  <div className="producto-fila-header">
                    <span className="producto-codigo">{p.Codigo_Producto}</span>
                    <span className="cat-pill">{p.Nombre_Categoria}</span>
                    <span className={`estado-pill ${p.Activo_Catalogo ? 'activo' : 'inactivo'}`}>
                      {p.Activo_Catalogo ? '👁️ Visible en tienda' : '🙈 Oculto'}
                    </span>
                  </div>
                  <div className="producto-fila-nombre">{p.Nombre}</div>
                  <div className="producto-fila-desc">{p.Descripcion}</div>
                  <div className="producto-fila-meta">
                    <span className="producto-precio">${Number(p.Precio).toLocaleString('es-CO')}</span>
                    <span className="producto-cantidad">Stock: <strong>{p.Cantidad}</strong></span>
                  </div>
                </div>

                {!esTecnico && (
                  <div className="producto-fila-actions" style={{ flexDirection: 'column' }}>
                    <button className="btn-outline" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => toggleEstado(p)}>
                      {p.Activo_Catalogo ? 'Ocultar' : 'Mostrar'}
                    </button>
                    <button className="btn-editar" onClick={() => { setEditando(true); setForm(p); }}>Editar</button>
                    <button className="btn-eliminar" onClick={() => eliminar(p.Codigo_Producto)}>Eliminar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        <aside className="form-panel">
          {!esTecnico && (
            <div className="panel-card" style={{ marginBottom: 20 }}>
              <h4 className="panel-title">{editando ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h4>
              <div className="campo"><label>Código *</label>
                <input value={form.Codigo_Producto} onChange={e => setForm({...form, Codigo_Producto: e.target.value})} disabled={editando} />
              </div>
              <div className="campo"><label>Nombre *</label>
                <input value={form.Nombre} onChange={e => setForm({...form, Nombre: e.target.value})} />
              </div>
              <div className="campo"><label>Categoría *</label>
                <select value={form.ID_Categoria} onChange={e => setForm({...form, ID_Categoria: e.target.value})}>
                  <option value="">Seleccione...</option>
                  {categorias.map(c => <option key={c.ID_Categoria} value={c.ID_Categoria}>{c.Nombre_Categoria}</option>)}
                </select>
              </div>
              <div className="campo"><label>Precio *</label>
                <input type="number" value={form.Precio} onChange={e => setForm({...form, Precio: e.target.value})} />
              </div>
              <div className="campo"><label>Stock *</label>
                <input type="number" value={form.Cantidad} onChange={e => setForm({...form, Cantidad: e.target.value})} />
              </div>
              <div className="campo"><label>Descripción</label>
                <textarea rows="2" value={form.Descripcion} onChange={e => setForm({...form, Descripcion: e.target.value})} />
              </div>
              <button className="btn-primary w-full" onClick={guardar}>{editando ? 'Actualizar' : 'Guardar'}</button>
              {editando && <button className="btn-ghost w-full mt-2" onClick={limpiar}>Cancelar</button>}
            </div>
          )}

          <div className="panel-card">
            <h4 className="panel-title">❓ Preguntas de Clientes</h4>
            <div className="preguntas-lista">
              {preguntas.length === 0 ? <div className="empty-state" style={{ padding: 10 }}>Ninguna pregunta</div> :
                preguntas.map((pr, i) => (
                  <div key={i} className="pregunta-item">
                    <div className="pregunta-header">
                      <div>
                        <span className="pregunta-usuario">{pr.Nombre_Usuario}</span>
                        <span className="pregunta-producto">sobre {pr.Nombre_Producto}</span>
                      </div>
                      <span className="pregunta-fecha">{new Date(pr.Fecha).toLocaleDateString('es-CO')}</span>
                    </div>
                    <div className="pregunta-texto">"{pr.Pregunta}"</div>
                  </div>
                ))
              }
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function Catalogo({ token, rol }) {
  if (rol === 2) return <CatalogoCliente token={token} />;
  return <CatalogoAdmin token={token} rol={rol} />;
}
