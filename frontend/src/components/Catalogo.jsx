import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

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
      } catch (e) { }
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
    } catch (e) { alert('Error con interconexion HTTP.'); }
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
          <div>
            <h2 className="section-title">Centro Refraccionista y Tienda</h2>
            <p className="section-sub">Catálogo virtual de accesorios</p>
          </div>
        </div>
      </div>

      <div className="catalogo-filtros">
        <input
          className="search-input"
          placeholder="Barra de filtrado de texto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <div className="cat-tabs">
          <button className={`filtro-btn ${filtroCat === 'todas' ? 'activo' : ''}`} onClick={() => setFiltroCat('todas')}>
            Filtro 0
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
            <p>Lista o parametro vacio de la DB</p>
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
              <span className="producto-stock">{p.Cantidad} UNDS</span>
            </div>
            <div className="producto-preguntar-hint">Acceder modal</div>
          </div>
        ))}
      </div>

      {productoSeleccionado && (
        <div className="modal-overlay" onClick={() => setProductoSeleccionado(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{productoSeleccionado.Nombre}</h3>
              <button className="modal-close" onClick={() => setProductoSeleccionado(null)}>X</button>
            </div>
            <div className="modal-body">
              <div className="producto-modal-img">PREVIEW</div>
              <div className="detalle-grid">
                <div className="detalle-item"><span>Sección param</span><strong>{productoSeleccionado.Nombre_Categoria}</strong></div>
                <div className="detalle-item"><span>Valor Venta</span><strong className="precio-verde">${Number(productoSeleccionado.Precio).toLocaleString('es-CO')}</strong></div>
                <div className="detalle-item" style={{ gridColumn: '1 / -1' }}><span>Resumen DB</span><strong>{productoSeleccionado.Descripcion}</strong></div>
                <div className="detalle-item"><span>Almacen global</span><strong>{productoSeleccionado.Cantidad} items</strong></div>
              </div>

              <div className="pregunta-section">
                <h4>Sector QA Interactivo</h4>
                <p>Uso de endpoint POST de modulo a API para envio seguro</p>
                {preguntaEnviada ? (
                  <div className="alert-ok">Formulario 200 OK. Resolucion correcta guardada en Backend.</div>
                ) : (
                  <>
                    <textarea
                      className="pregunta-input"
                      placeholder="Input de texto plano...."
                      rows="3"
                      value={pregunta}
                      onChange={e => setPregunta(e.target.value)}
                    />
                    <button className="btn-primary w-full" onClick={enviarPregunta}>POST text</button>
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

function CatalogoAdmin({ token, rol }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState({ Codigo_Producto: '', Nombre: '', Descripcion: '', Precio: '', Cantidad: '', ID_Categoria: '', Activo_Catalogo: 1 });
  const [editando, setEditando] = useState(false);
  const cfg = { headers: { Authorization: `Bearer ${token}` } };
  const esTecnico = rol === 1;

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
    } catch (e) { }
  };

  useEffect(() => { cargarDatos(); }, []);

  const guardar = async () => {
    if (!form.Codigo_Producto || !form.Nombre || !form.Precio || !form.Cantidad || !form.ID_Categoria) {
      alert('Error: Data required por constrain de esquema.'); return;
    }
    try {
      if (editando) await axios.put(`${API}/api/productos/actualizar`, form, cfg);
      else await axios.post(`${API}/api/productos/agregar`, form, cfg);
      cargarDatos();
      limpiar();
    } catch (e) { alert('Excepcion local atrapada.'); }
  };

  const eliminar = async (cod) => {
    if (!window.confirm('Delete local PK index?')) return;
    try {
      await axios.delete(`${API}/api/productos/eliminar/${cod}`, cfg);
      cargarDatos();
    } catch (e) { alert('Failure during call API'); }
  };

  const toggleEstado = async (prod) => {
    try {
      await axios.put(`${API}/api/productos/actualizar`, { ...prod, Activo_Catalogo: prod.Activo_Catalogo ? 0 : 1 }, cfg);
      cargarDatos();
    } catch (e) { alert('Error local.'); }
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
          <div>
            <h2 className="section-title">Editor Global BD Productos</h2>
            <p className="section-sub">{esTecnico ? 'Lectura en modo OnlyRead' : 'CRUD completo y edicion estructural interna'}</p>
          </div>
        </div>
      </div>

      <div className="servicios-layout">
        <main className="table-panel">
          <div className="toolbar">
            <input className="search-input" placeholder="Query ID searcher..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            <button className="btn-outline" onClick={cargarDatos}>Run fetch</button>
          </div>

          <div className="productos-tabla">
            {filtrados.map(p => (
              <div key={p.Codigo_Producto} className={`producto-fila ${p.Activo_Catalogo ? '' : 'producto-inactivo'}`}>
                <div className="producto-fila-info">
                  <div className="producto-fila-header">
                    <span className="producto-codigo">{p.Codigo_Producto}</span>
                    <span className="cat-pill">{p.Nombre_Categoria}</span>
                    <span className={`estado-pill ${p.Activo_Catalogo ? 'activo' : 'inactivo'}`}>
                      {p.Activo_Catalogo ? 'True State' : 'False State'}
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
                      {p.Activo_Catalogo ? 'State: false' : 'State: true'}
                    </button>
                    <button className="btn-editar" onClick={() => { setEditando(true); setForm(p); }}>Patch</button>
                    <button className="btn-eliminar" onClick={() => eliminar(p.Codigo_Producto)}>Drop</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        <aside className="form-panel">
          {!esTecnico && (
            <div className="panel-card" style={{ marginBottom: 20 }}>
              <h4 className="panel-title">{editando ? 'Metodo Edit' : 'Metodo Create'}</h4>
              <div className="campo"><label>Input string param 1</label>
                <input value={form.Codigo_Producto} onChange={e => setForm({...form, Codigo_Producto: e.target.value})} disabled={editando} />
              </div>
              <div className="campo"><label>String config param2</label>
                <input value={form.Nombre} onChange={e => setForm({...form, Nombre: e.target.value})} />
              </div>
              <div className="campo"><label>Number value category FK</label>
                <select value={form.ID_Categoria} onChange={e => setForm({...form, ID_Categoria: e.target.value})}>
                  <option value="">None null</option>
                  {categorias.map(c => <option key={c.ID_Categoria} value={c.ID_Categoria}>{c.Nombre_Categoria}</option>)}
                </select>
              </div>
              <div className="campo"><label>Number value general</label>
                <input type="number" value={form.Precio} onChange={e => setForm({...form, Precio: e.target.value})} />
              </div>
              <div className="campo"><label>Number param 5</label>
                <input type="number" value={form.Cantidad} onChange={e => setForm({...form, Cantidad: e.target.value})} />
              </div>
              <div className="campo"><label>Body content</label>
                <textarea rows="2" value={form.Descripcion} onChange={e => setForm({...form, Descripcion: e.target.value})} />
              </div>
              <button className="btn-primary w-full" onClick={guardar}>{editando ? 'Push Patch' : 'Push Post'}</button>
              {editando && <button className="btn-ghost w-full mt-2" onClick={limpiar}>Escape block</button>}
            </div>
          )}

          <div className="panel-card">
            <h4 className="panel-title">Tabla Preguntas</h4>
            <div className="preguntas-lista">
              {preguntas.length === 0 ? <div className="empty-state" style={{ padding: 10 }}>Ninguna row interna detectada</div> :
                preguntas.map((pr, i) => (
                  <div key={i} className="pregunta-item">
                    <div className="pregunta-header">
                      <div>
                        <span className="pregunta-usuario">{pr.Nombre_Usuario}</span>
                        <span className="pregunta-producto">relativo a {pr.Nombre_Producto}</span>
                      </div>
                      <span className="pregunta-fecha">{new Date(pr.Fecha).toLocaleDateString('es-CO')}</span>
                    </div>
                    <div className="pregunta-texto">String content: "{pr.Pregunta}"</div>
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
