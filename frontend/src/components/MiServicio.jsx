import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// RF014 — Vista de seguimiento de servicios del cliente
const MiServicio = ({ cerrarSesion, setVista }) => {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });
  const usuario = localStorage.getItem('user') || '';

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3500);
  };

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/servicios/mis-servicios/${usuario}`, config());
      setServicios(res.data);
    } catch (err) {
      mostrarToast('Error al cargar tus servicios. Verifica tu conexión.', 'danger');
    } finally {
      setCargando(false);
    }
  };

  const cancelarServicio = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar este servicio? Esta acción no se puede deshacer.')) return;
    try {
      await axios.patch(`http://localhost:3000/api/servicios/cancelar/${id}`, {}, config());
      mostrarToast('Servicio cancelado correctamente.', 'warning');
      cargar();
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo cancelar el servicio.';
      mostrarToast(msg, 'danger');
    }
  };

  const etapaInfo = (etapa) => {
    const e = Number(etapa);
    if (e === -1) return { texto: ' Cancelado', color: '#6c757d', porcentaje: 0 };
    if (e === 0)  return { texto: ' Recibido', color: '#0d6efd', porcentaje: 10 };
    if (e <= 25)  return { texto: ' En Diagnóstico', color: '#0dcaf0', porcentaje: 25 };
    if (e <= 50)  return { texto: ' En Reparación', color: '#ffc107', porcentaje: 50 };
    if (e <= 75)  return { texto: ' Control de Calidad', color: '#fd7e14', porcentaje: 75 };
    if (e === 100) return { texto: ' Listo para Retirar', color: '#198754', porcentaje: 100 };
    return { texto: `En proceso (${e}%)`, color: '#6c757d', porcentaje: e };
  };

  return (
    <div>
      {/* TOAST */}
      {toast.visible && (
        <div className={`toast show position-fixed top-0 end-0 m-3 text-white bg-${toast.tipo}`}
          style={{ zIndex: 9999, minWidth: '280px' }} role="alert">
          <div className="toast-body fw-bold">{toast.mensaje}</div>
        </div>
      )}

      {/* NAVBAR */}
      <Navbar titulo="CELUACCEL — Mis Servicios" cerrarSesion={cerrarSesion} />

      <div className="container mt-4">
        {/* BANNER */}
        <div className="mb-4 p-4 rounded-3 text-white" style={{ background: 'linear-gradient(135deg, #DB0000, #8B0000)' }}>
          <h4 className="fw-bold mb-1"> Seguimiento de mis Servicios</h4>
          <p className="mb-0 opacity-75">Usuario: <strong>{usuario}</strong> — {servicios.length} servicio(s) registrado(s)</p>
        </div>

        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#DB0000' }} role="status" />
            <p className="mt-3 text-muted">Cargando tus servicios...</p>
          </div>
        ) : servicios.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '4rem' }}></div>
            <h5 className="text-muted mt-3">No tienes servicios registrados</h5>
            <button className="btn text-white fw-bold mt-3" style={{ backgroundColor: '#DB0000' }}
              onClick={() => setVista('servicios')}>
              Solicitar un Servicio
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {servicios.map(s => {
              const info = etapaInfo(s.Etapa);
              const cancelable = Number(s.Etapa) !== 100 && Number(s.Etapa) !== -1;
              return (
                <div key={s.ID_Servicio} className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header d-flex justify-content-between align-items-center"
                      style={{ backgroundColor: '#f8f9fa' }}>
                      <span className="fw-bold">Servicio #{s.ID_Servicio}</span>
                      <span className="badge" style={{ backgroundColor: info.color }}>{info.texto}</span>
                    </div>
                    <div className="card-body">
                      <p className="mb-1"><strong> Dispositivo:</strong> {s.Movil_Nombre}</p>
                      <p className="mb-1"><strong> Descripción:</strong> {s.Descripcion}</p>
                      <p className="mb-1"><strong> Especificación:</strong> {s.Movil_Especificacion}</p>
                      <p className="mb-1"><strong> Precio:</strong> ${s.Precio}</p>
                      <p className="mb-3"><strong> Fecha:</strong> {s.Fecha ? String(s.Fecha).split('T')[0] : '—'}</p>

                      {/* BARRA DE PROGRESO */}
                      {Number(s.Etapa) !== -1 && (
                        <div className="mb-3">
                          <div className="d-flex justify-content-between small text-muted mb-1">
                            <span>Progreso</span>
                            <span>{info.porcentaje}%</span>
                          </div>
                          <div className="progress" style={{ height: '10px' }}>
                            <div className="progress-bar" role="progressbar"
                              style={{ width: `${info.porcentaje}%`, backgroundColor: info.color }}
                              aria-valuenow={info.porcentaje} aria-valuemin="0" aria-valuemax="100" />
                          </div>
                          {/* ETAPAS VISUALES */}
                          <div className="d-flex justify-content-between mt-2" style={{ fontSize: '0.65rem', color: '#6c757d' }}>
                            <span> Recibido</span>
                            <span> Diagnóstico</span>
                            <span> Reparación</span>
                            <span> Calidad</span>
                            <span> Listo</span>
                          </div>
                        </div>
                      )}

                      <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-sm text-white fw-bold"
                          style={{ backgroundColor: '#121212' }}
                          onClick={() => setVista('chatVista')}>
                           Abrir Chat
                        </button>
                        {cancelable && (
                          <button className="btn btn-sm text-white fw-bold"
                            style={{ backgroundColor: '#DB0000' }}
                            onClick={() => cancelarServicio(s.ID_Servicio)}>
                             Cancelar Servicio
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MENÚ LATERAL */}
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

export default MiServicio;
