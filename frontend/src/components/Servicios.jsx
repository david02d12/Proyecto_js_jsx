import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

const etapaColor = (e) => e >= 100 ? '#22c55e' : e >= 70 ? '#3b82f6' : e >= 40 ? '#f59e0b' : '#ef4444';
const etapaLabel = (e) => e >= 100 ? 'Completado' : e >= 70 ? 'Casi listo' : e >= 40 ? 'En proceso' : 'Iniciado';

// ─── VISTA CLIENTE ─────────────────────────────────────────────────────────────
function ServiciosCliente({ token, userId }) {
  const [servicios, setServicios] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(false);
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const res = await axios.get(`${API}/api/servicios/listar`, cfg);
        // El cliente solo ve sus propios servicios
        setServicios(res.data.filter(s => String(s.ID_Usuario) === String(userId)));
      } catch (e) { console.error(e); }
      setCargando(false);
    };
    cargar();
  }, []);

  const verDetalle = async (id) => {
    try {
      const res = await axios.get(`${API}/api/servicios/${id}`, cfg);
      setDetalle(res.data);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="servicios-container">
      <div className="page-header">
        <div className="rol-banner cliente-banner">
          <span className="rol-icono">👤</span>
          <div>
            <h2 className="section-title">Mis Servicios</h2>
            <p className="section-sub">Seguimiento del estado de tus reparaciones</p>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="loading-state">Cargando tus servicios...</div>
      ) : servicios.length === 0 ? (
        <div className="empty-state">
          <span>📱</span>
          <p>No tienes servicios registrados aún</p>
          <small>Visita nuestra tienda para registrar una reparación</small>
        </div>
      ) : (
        <div className="servicios-grid">
          {servicios.map(s => (
            <div key={s.ID_Servicio} className="servicio-card cliente-card" onClick={() => verDetalle(s.ID_Servicio)}>
              <div className="servicio-card-header">
                <div>
                  <span className="servicio-id">Servicio #{s.ID_Servicio}</span>
                  <span className="etapa-badge" style={{ backgroundColor: etapaColor(s.Etapa) + '20', color: etapaColor(s.Etapa), borderColor: etapaColor(s.Etapa) + '40' }}>
                    {etapaLabel(s.Etapa)}
                  </span>
                </div>
                <div className="servicio-precio">${Number(s.Precio).toLocaleString('es-CO')}</div>
              </div>

              <div className="servicio-movil">📱 {s.Movil_Nombre}</div>
              <div className="servicio-desc">{s.Descripcion}</div>

              <div className="progress-container">
                <div className="progress-info">
                  <span>Estado de la reparación</span>
                  <span style={{ color: etapaColor(s.Etapa), fontWeight: 700 }}>{s.Etapa}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${s.Etapa}%`, backgroundColor: etapaColor(s.Etapa) }} />
                </div>
              </div>

              <div className="servicio-fecha">📅 {s.Fecha ? new Date(s.Fecha).toLocaleDateString('es-CO') : '—'}</div>
              <div className="ver-mas-hint">Toca para ver el historial →</div>
            </div>
          ))}
        </div>
      )}

      {/* Modal detalle cliente */}
      {detalle && (
        <div className="modal-overlay" onClick={() => setDetalle(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📱 {detalle.Movil_Nombre}</h3>
              <button className="modal-close" onClick={() => setDetalle(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detalle-grid">
                <div className="detalle-item"><span>Problema reportado</span><strong>{detalle.Descripcion}</strong></div>
                <div className="detalle-item"><span>Especificación</span><strong>{detalle.Movil_Especificacion}</strong></div>
                <div className="detalle-item"><span>Fecha de ingreso</span><strong>{detalle.Fecha ? new Date(detalle.Fecha).toLocaleDateString('es-CO') : '—'}</strong></div>
                <div className="detalle-item"><span>Costo del servicio</span><strong className="precio-verde">${Number(detalle.Precio).toLocaleString('es-CO')}</strong></div>
              </div>

              <div className="detalle-progreso">
                <div className="progress-info">
                  <span>Progreso de la reparación</span>
                  <strong style={{ color: etapaColor(detalle.Etapa) }}>{detalle.Etapa}% — {etapaLabel(detalle.Etapa)}</strong>
                </div>
                <div className="progress-bar grande">
                  <div className="progress-fill" style={{ width: `${detalle.Etapa}%`, backgroundColor: etapaColor(detalle.Etapa) }} />
                </div>
              </div>

              {detalle.historial?.length > 0 && (
                <div className="historial-section">
                  <h4>Historial de eventos</h4>
                  <div className="timeline">
                    {detalle.historial.map((h, i) => (
                      <div key={i} className="timeline-item">
                        <div className={`timeline-dot ${h.Estado === '1' ? 'activo' : ''}`} />
                        <div className="timeline-content">
                          <div className="timeline-fecha">{new Date(h.Fecha_Evento).toLocaleDateString('es-CO')}</div>
                          <div className="timeline-desc">{h.Descripcion_Evento}</div>
                          <div className={`timeline-estado ${h.Estado === '1' ? 'completado' : 'pendiente'}`}>
                            {h.Estado === '1' ? '✅ Completado' : '⏳ Pendiente'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VISTA TÉCNICO ─────────────────────────────────────────────────────────────
function ServiciosTecnico({ token, userId }) {
  const [servicios, setServicios] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [editandoEtapa, setEditandoEtapa] = useState(null);
  const [nuevaEtapa, setNuevaEtapa] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEtapa, setFiltroEtapa] = useState('todos');
  const [cargando, setCargando] = useState(false);
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  const listar = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${API}/api/servicios/listar`, cfg);
      setServicios(res.data);
    } catch (e) { console.error(e); }
    setCargando(false);
  };

  useEffect(() => { listar(); }, []);

  const actualizarEtapa = async (id) => {
    const etapa = Number(nuevaEtapa);
    if (isNaN(etapa) || etapa < 0 || etapa > 100) { alert('La etapa debe ser entre 0 y 100.'); return; }
    try {
      const srv = servicios.find(s => s.ID_Servicio === id);
      await axios.put(`${API}/api/servicios/actualizar`, { ...srv, Etapa: etapa, ID_Servicio: id, Fecha: srv.Fecha ? srv.Fecha.split('T')[0] : '' }, cfg);
      setEditandoEtapa(null);
      setNuevaEtapa('');
      listar();
    } catch (e) { alert('Error al actualizar.'); }
  };

  const verDetalle = async (id) => {
    try {
      const res = await axios.get(`${API}/api/servicios/${id}`, cfg);
      setDetalle(res.data);
    } catch (e) { console.error(e); }
  };

  const serviciosFiltrados = servicios.filter(s => {
    const coincideBusqueda =
      s.Descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.Movil_Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.Nombre_Cliente?.toLowerCase().includes(busqueda.toLowerCase());
    if (filtroEtapa === 'pendientes') return coincideBusqueda && s.Etapa < 100;
    if (filtroEtapa === 'completados') return coincideBusqueda && s.Etapa >= 100;
    if (filtroEtapa === 'en_proceso') return coincideBusqueda && s.Etapa >= 1 && s.Etapa < 100;
    return coincideBusqueda;
  });

  const stats = {
    total: servicios.length,
    pendientes: servicios.filter(s => s.Etapa < 40).length,
    en_proceso: servicios.filter(s => s.Etapa >= 40 && s.Etapa < 100).length,
    completados: servicios.filter(s => s.Etapa >= 100).length,
  };

  return (
    <div className="servicios-container">
      <div className="page-header">
        <div className="rol-banner tecnico-banner">
          <span className="rol-icono">🔧</span>
          <div>
            <h2 className="section-title">Panel Técnico — Servicios</h2>
            <p className="section-sub">Gestiona y actualiza el progreso de las reparaciones</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card"><span className="stat-num">{stats.total}</span><span className="stat-label">Total</span></div>
        <div className="stat-card rojo"><span className="stat-num">{stats.pendientes}</span><span className="stat-label">Por iniciar</span></div>
        <div className="stat-card amarillo"><span className="stat-num">{stats.en_proceso}</span><span className="stat-label">En proceso</span></div>
        <div className="stat-card verde"><span className="stat-num">{stats.completados}</span><span className="stat-label">Completados</span></div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="🔍 Buscar por descripción, móvil o cliente..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <div className="filtros-etapa">
          {[['todos','Todos'],['pendientes','Por iniciar'],['en_proceso','En proceso'],['completados','Completados']].map(([k,v]) => (
            <button key={k} className={`filtro-mini ${filtroEtapa === k ? 'activo' : ''}`} onClick={() => setFiltroEtapa(k)}>{v}</button>
          ))}
        </div>
        <button className="btn-outline" onClick={listar}>↻</button>
      </div>

      {cargando ? (
        <div className="loading-state">Cargando servicios...</div>
      ) : (
        <div className="servicios-grid">
          {serviciosFiltrados.map(s => (
            <div key={s.ID_Servicio} className="servicio-card">
              <div className="servicio-card-header">
                <div>
                  <span className="servicio-id">#{s.ID_Servicio}</span>
                  <span className="etapa-badge" style={{ backgroundColor: etapaColor(s.Etapa)+'20', color: etapaColor(s.Etapa), borderColor: etapaColor(s.Etapa)+'40' }}>
                    {etapaLabel(s.Etapa)}
                  </span>
                </div>
                <div className="servicio-precio">${Number(s.Precio).toLocaleString('es-CO')}</div>
              </div>

              <div className="servicio-movil">📱 {s.Movil_Nombre}</div>
              <div className="servicio-desc">{s.Descripcion}</div>
              {s.Nombre_Cliente && <div className="servicio-cliente">👤 {s.Nombre_Cliente}</div>}

              <div className="progress-container">
                <div className="progress-info"><span>Progreso</span><span>{s.Etapa}%</span></div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${s.Etapa}%`, backgroundColor: etapaColor(s.Etapa) }} />
                </div>
              </div>

              {/* Actualizar etapa inline */}
              {editandoEtapa === s.ID_Servicio ? (
                <div className="etapa-edit">
                  <input
                    type="number" min="0" max="100"
                    className="etapa-input"
                    value={nuevaEtapa}
                    onChange={e => setNuevaEtapa(e.target.value)}
                    placeholder="0-100"
                    autoFocus
                  />
                  <button className="btn-confirmar" onClick={() => actualizarEtapa(s.ID_Servicio)}>✓</button>
                  <button className="btn-cancelar-sm" onClick={() => { setEditandoEtapa(null); setNuevaEtapa(''); }}>✕</button>
                </div>
              ) : (
                <div className="servicio-fecha">📅 {s.Fecha ? new Date(s.Fecha).toLocaleDateString('es-CO') : '—'}</div>
              )}

              <div className="servicio-actions">
                <button className="btn-ver" onClick={() => verDetalle(s.ID_Servicio)}>Ver</button>
                <button
                  className="btn-editar"
                  onClick={() => { setEditandoEtapa(s.ID_Servicio); setNuevaEtapa(String(s.Etapa)); }}
                >
                  📊 Actualizar %
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal detalle */}
      {detalle && (
        <div className="modal-overlay" onClick={() => setDetalle(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Servicio #{detalle.ID_Servicio} — {detalle.Movil_Nombre}</h3>
              <button className="modal-close" onClick={() => setDetalle(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detalle-grid">
                <div className="detalle-item"><span>Cliente</span><strong>👤 {detalle.Nombre_Cliente}</strong></div>
                <div className="detalle-item"><span>Documento</span><strong>{detalle.ID_Usuario}</strong></div>
                <div className="detalle-item"><span>Descripción</span><strong>{detalle.Descripcion}</strong></div>
                <div className="detalle-item"><span>Especificación</span><strong>{detalle.Movil_Especificacion}</strong></div>
                <div className="detalle-item"><span>Precio</span><strong className="precio-verde">${Number(detalle.Precio).toLocaleString('es-CO')}</strong></div>
                <div className="detalle-item"><span>Fecha</span><strong>{detalle.Fecha ? new Date(detalle.Fecha).toLocaleDateString('es-CO') : '—'}</strong></div>
              </div>
              <div className="detalle-progreso">
                <div className="progress-info">
                  <span>Progreso</span>
                  <strong style={{ color: etapaColor(detalle.Etapa) }}>{detalle.Etapa}% — {etapaLabel(detalle.Etapa)}</strong>
                </div>
                <div className="progress-bar grande">
                  <div className="progress-fill" style={{ width: `${detalle.Etapa}%`, backgroundColor: etapaColor(detalle.Etapa) }} />
                </div>
              </div>
              {detalle.historial?.length > 0 && (
                <div className="historial-section">
                  <h4>Historial</h4>
                  <div className="timeline">
                    {detalle.historial.map((h, i) => (
                      <div key={i} className="timeline-item">
                        <div className={`timeline-dot ${h.Estado === '1' ? 'activo' : ''}`} />
                        <div className="timeline-content">
                          <div className="timeline-fecha">{new Date(h.Fecha_Evento).toLocaleDateString('es-CO')}</div>
                          <div className="timeline-desc">{h.Descripcion_Evento}</div>
                          <div className={`timeline-estado ${h.Estado === '1' ? 'completado' : 'pendiente'}`}>
                            {h.Estado === '1' ? '✅ Completado' : '⏳ Pendiente'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VISTA ADMINISTRADOR ────────────────────────────────────────────────────────
function ServiciosAdmin({ token, userId }) {
  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({ Descripcion: '', ID_Usuario: '', Precio: '', Movil_Nombre: '', Movil_Especificacion: '', Fecha: '', Etapa: '' });
  const [editando, setEditando] = useState(false);
  const [idSel, setIdSel] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  const listar = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${API}/api/servicios/listar`, cfg);
      setServicios(res.data);
    } catch (e) { console.error(e); }
    setCargando(false);
  };

  useEffect(() => { listar(); }, []);

  const guardar = async () => {
    if (!form.Descripcion || !form.ID_Usuario || !form.Precio || !form.Movil_Nombre || !form.Fecha) {
      alert('Completa todos los campos obligatorios.'); return;
    }
    try {
      if (editando) await axios.put(`${API}/api/servicios/actualizar`, { ...form, ID_Servicio: idSel }, cfg);
      else await axios.post(`${API}/api/servicios/agregar`, form, cfg);
      listar(); limpiar();
    } catch (e) { alert('Error al guardar.'); }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este servicio? Esta acción no se puede deshacer.')) return;
    try { await axios.delete(`${API}/api/servicios/eliminar/${id}`, cfg); listar(); }
    catch (e) { alert('Error al eliminar.'); }
  };

  const verDetalle = async (id) => {
    try { const res = await axios.get(`${API}/api/servicios/${id}`, cfg); setDetalle(res.data); }
    catch (e) { console.error(e); }
  };

  const limpiar = () => {
    setForm({ Descripcion: '', ID_Usuario: '', Precio: '', Movil_Nombre: '', Movil_Especificacion: '', Fecha: '', Etapa: '' });
    setEditando(false); setIdSel(null);
  };

  const filtrados = servicios.filter(s =>
    s.Descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.Movil_Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.Nombre_Cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
    String(s.ID_Servicio).includes(busqueda)
  );

  const stats = {
    total: servicios.length,
    completados: servicios.filter(s => s.Etapa >= 100).length,
    en_proceso: servicios.filter(s => s.Etapa >= 1 && s.Etapa < 100).length,
    ingresos: servicios.reduce((acc, s) => acc + Number(s.Precio), 0),
  };

  return (
    <div className="servicios-container">
      <div className="page-header">
        <div className="rol-banner admin-banner">
          <span className="rol-icono">⚙️</span>
          <div>
            <h2 className="section-title">Administración de Servicios</h2>
            <p className="section-sub">Control total: crear, editar y eliminar registros</p>
          </div>
        </div>
      </div>

      {/* Stats admin */}
      <div className="stats-row">
        <div className="stat-card"><span className="stat-num">{stats.total}</span><span className="stat-label">Total servicios</span></div>
        <div className="stat-card amarillo"><span className="stat-num">{stats.en_proceso}</span><span className="stat-label">En proceso</span></div>
        <div className="stat-card verde"><span className="stat-num">{stats.completados}</span><span className="stat-label">Completados</span></div>
        <div className="stat-card azul"><span className="stat-num">${stats.ingresos.toLocaleString('es-CO')}</span><span className="stat-label">Total ingresos</span></div>
      </div>

      <div className="servicios-layout">
        {/* Formulario */}
        <aside className="form-panel">
          <div className="panel-card">
            <h4 className="panel-title">{editando ? '✏️ Editar Servicio' : '➕ Nuevo Servicio'}</h4>
            <div className="campo"><label>Descripción *</label>
              <input value={form.Descripcion} onChange={e => setForm({...form,Descripcion:e.target.value})} placeholder="Ej: Pantalla rota" />
            </div>
            <div className="campo"><label>Documento del cliente *</label>
              <input value={form.ID_Usuario} onChange={e => setForm({...form,ID_Usuario:e.target.value})} placeholder="Número de documento" />
            </div>
            <div className="campo"><label>Precio ($) *</label>
              <input type="number" value={form.Precio} onChange={e => setForm({...form,Precio:e.target.value})} placeholder="0" />
            </div>
            <div className="campo"><label>Nombre del móvil *</label>
              <input value={form.Movil_Nombre} onChange={e => setForm({...form,Movil_Nombre:e.target.value})} placeholder="Ej: iPhone 14" />
            </div>
            <div className="campo"><label>Especificación</label>
              <input value={form.Movil_Especificacion} onChange={e => setForm({...form,Movil_Especificacion:e.target.value})} placeholder="Detalles del daño" />
            </div>
            <div className="campo"><label>Fecha *</label>
              <input type="date" value={form.Fecha} onChange={e => setForm({...form,Fecha:e.target.value})} />
            </div>
            <div className="campo"><label>Etapa (0-100)</label>
              <input type="number" min="0" max="100" value={form.Etapa} onChange={e => setForm({...form,Etapa:e.target.value})} placeholder="0" />
              {form.Etapa !== '' && (
                <div className="mini-progress"><div style={{ width:`${form.Etapa}%`, backgroundColor:etapaColor(Number(form.Etapa)) }} /></div>
              )}
            </div>
            <button className="btn-primary w-full" onClick={guardar}>{editando ? 'Actualizar' : 'Guardar Servicio'}</button>
            {editando && <button className="btn-ghost w-full mt-2" onClick={limpiar}>Cancelar</button>}
          </div>
        </aside>

        <main className="table-panel">
          <div className="toolbar">
            <input className="search-input" placeholder="🔍 Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            <button className="btn-outline" onClick={listar}>↻ Actualizar</button>
          </div>
          {cargando ? <div className="loading-state">Cargando...</div> : (
            <div className="servicios-grid">
              {filtrados.map(s => (
                <div key={s.ID_Servicio} className="servicio-card">
                  <div className="servicio-card-header">
                    <div>
                      <span className="servicio-id">#{s.ID_Servicio}</span>
                      <span className="etapa-badge" style={{ backgroundColor:etapaColor(s.Etapa)+'20', color:etapaColor(s.Etapa), borderColor:etapaColor(s.Etapa)+'40' }}>
                        {etapaLabel(s.Etapa)}
                      </span>
                    </div>
                    <div className="servicio-precio">${Number(s.Precio).toLocaleString('es-CO')}</div>
                  </div>
                  <div className="servicio-movil">📱 {s.Movil_Nombre}</div>
                  <div className="servicio-desc">{s.Descripcion}</div>
                  {s.Nombre_Cliente && <div className="servicio-cliente">👤 {s.Nombre_Cliente}</div>}
                  <div className="progress-container">
                    <div className="progress-info"><span>Progreso</span><span>{s.Etapa}%</span></div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width:`${s.Etapa}%`, backgroundColor:etapaColor(s.Etapa) }} /></div>
                  </div>
                  <div className="servicio-fecha">📅 {s.Fecha ? new Date(s.Fecha).toLocaleDateString('es-CO') : '—'}</div>
                  <div className="servicio-actions">
                    <button className="btn-ver" onClick={() => verDetalle(s.ID_Servicio)}>Ver</button>
                    <button className="btn-editar" onClick={() => { setEditando(true); setIdSel(s.ID_Servicio); setForm({...s, Fecha: s.Fecha ? s.Fecha.split('T')[0] : ''}); }}>Editar</button>
                    <button className="btn-eliminar" onClick={() => eliminar(s.ID_Servicio)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {detalle && (
        <div className="modal-overlay" onClick={() => setDetalle(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Servicio #{detalle.ID_Servicio}</h3>
              <button className="modal-close" onClick={() => setDetalle(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detalle-grid">
                <div className="detalle-item"><span>Móvil</span><strong>📱 {detalle.Movil_Nombre}</strong></div>
                <div className="detalle-item"><span>Cliente</span><strong>👤 {detalle.Nombre_Cliente}</strong></div>
                <div className="detalle-item"><span>Descripción</span><strong>{detalle.Descripcion}</strong></div>
                <div className="detalle-item"><span>Especificación</span><strong>{detalle.Movil_Especificacion}</strong></div>
                <div className="detalle-item"><span>Precio</span><strong className="precio-verde">${Number(detalle.Precio).toLocaleString('es-CO')}</strong></div>
                <div className="detalle-item"><span>Fecha</span><strong>{detalle.Fecha ? new Date(detalle.Fecha).toLocaleDateString('es-CO') : '—'}</strong></div>
              </div>
              <div className="detalle-progreso">
                <div className="progress-info"><span>Progreso</span><strong style={{ color:etapaColor(detalle.Etapa) }}>{detalle.Etapa}% — {etapaLabel(detalle.Etapa)}</strong></div>
                <div className="progress-bar grande"><div className="progress-fill" style={{ width:`${detalle.Etapa}%`, backgroundColor:etapaColor(detalle.Etapa) }} /></div>
              </div>
              {detalle.historial?.length > 0 && (
                <div className="historial-section">
                  <h4>Historial del servicio</h4>
                  <div className="timeline">
                    {detalle.historial.map((h, i) => (
                      <div key={i} className="timeline-item">
                        <div className={`timeline-dot ${h.Estado === '1' ? 'activo' : ''}`} />
                        <div className="timeline-content">
                          <div className="timeline-fecha">{new Date(h.Fecha_Evento).toLocaleDateString('es-CO')}</div>
                          <div className="timeline-desc">{h.Descripcion_Evento}</div>
                          <div className={`timeline-estado ${h.Estado === '1' ? 'completado' : 'pendiente'}`}>{h.Estado === '1' ? '✅ Completado' : '⏳ Pendiente'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ENRUTADOR POR ROL ──────────────────────────────────────────────────────────
export default function Servicios({ token, userId, rol }) {
  if (rol === 2) return <ServiciosCliente token={token} userId={userId} />;
  if (rol === 1) return <ServiciosTecnico token={token} userId={userId} />;
  return <ServiciosAdmin token={token} userId={userId} />;
}
