import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Home = ({ cerrarSesion, setVista }) => {
  const [stats, setStats] = useState({
    servicios: 0, usuarios: 0, productos: 0, historial: 0
  });
  const [serviciosRecientes, setServiciosRecientes] = useState([]);
  const usuario = localStorage.getItem('user') || 'Usuario';

  const config = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [svcRes, usrRes, prdRes, hisRes] = await Promise.all([
          axios.get('http://localhost:3000/api/servicios/listar', config()),
          axios.get('http://localhost:3000/api/usuarios/listar', config()),
          axios.get('http://localhost:3000/api/productos/listar', config()),
          axios.get('http://localhost:3000/api/historial/listar', config()),
        ]);
        setStats({
          servicios: svcRes.data.length,
          usuarios: usrRes.data.length,
          productos: prdRes.data.length,
          historial: hisRes.data.length,
        });
        setServiciosRecientes(svcRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
      }
    };
    cargarDatos();
  }, []);

  const etapaLabel = (etapa) => {
    if (etapa <= 25) return { texto: 'Recibido', color: '#6c757d' };
    if (etapa <= 50) return { texto: 'En Diagnóstico', color: '#0dcaf0' };
    if (etapa <= 75) return { texto: 'En Reparación', color: '#ffc107' };
    return { texto: 'Listo', color: '#198754' };
  };

  return (
    <div>
      {/* NAVBAR */}
      <Navbar titulo="CELUACCEL — Panel Principal" cerrarSesion={cerrarSesion} />

      <div className="container mt-4">
        {/* BIENVENIDA */}
        <div className="mb-4 p-4 rounded-3 text-white" style={{ background: 'linear-gradient(135deg, #DB0000, #8B0000)' }}>
          <h4 className="fw-bold mb-1"> Bienvenido, {usuario}</h4>
          <p className="mb-0 opacity-75">Este es tu panel de control del sistema Celuaccel.</p>
        </div>

        {/* TARJETAS DE ESTADÍSTICAS */}
        <div className="row g-3 mb-4">
          {[
            { titulo: 'Servicios Activos', valor: stats.servicios, icono: '', vista: 'servicios', color: '#DB0000' },
            { titulo: 'Usuarios', valor: stats.usuarios, icono: '', vista: 'usuarios', color: '#121212' },
            { titulo: 'Productos', valor: stats.productos, icono: '', vista: 'productos', color: '#DB0000' },
            { titulo: 'Eventos Historial', valor: stats.historial, icono: '', vista: 'historial', color: '#121212' },
          ].map((card, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }}
                onClick={() => setVista(card.vista)}>
                <div className="card-body text-center py-4">
                  <div style={{ fontSize: '2rem' }}>{card.icono}</div>
                  <h2 className="fw-bold my-1" style={{ color: card.color }}>{card.valor}</h2>
                  <p className="text-muted small mb-0">{card.titulo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ACCESOS RÁPIDOS */}
        <div className="row g-3 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header fw-bold" style={{ backgroundColor: '#f8f9fa' }}>
                 Accesos Rápidos
              </div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-2">
                  {[
                    { label: ' Nuevo Servicio', vista: 'servicios' },
                    { label: ' Mis Servicios', vista: 'miServicio' },
                    { label: ' Chat', vista: 'chatVista' },
                    { label: ' Catálogo', vista: 'catalogo' },
                    { label: ' Notificaciones', vista: 'notificaciones' },
                    { label: ' Comentarios', vista: 'comentarios' },
                    { label: ' Historial', vista: 'historial' },
                  ].map((acc, i) => (
                    <button key={i} className="btn text-white fw-bold"
                      style={{ backgroundColor: i % 2 === 0 ? '#DB0000' : '#121212' }}
                      onClick={() => setVista(acc.vista)}>
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SERVICIOS RECIENTES */}
        <div className="card border-0 shadow-sm">
          <div className="card-header fw-bold d-flex justify-content-between align-items-center"
            style={{ backgroundColor: '#f8f9fa' }}>
            <span> Servicios Recientes</span>
            <button className="btn btn-sm text-white fw-bold" style={{ backgroundColor: '#DB0000' }}
              onClick={() => setVista('servicios')}>Ver todos</button>
          </div>
          <div className="card-body p-0">
            {serviciosRecientes.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No hay servicios registrados aún.</p>
            ) : (
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Dispositivo</th>
                    <th>Progreso</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {serviciosRecientes.map(s => {
                    const etapa = Number(s.Etapa) || 0;
                    const label = etapaLabel(etapa);
                    return (
                      <tr key={s.ID_Servicio}>
                        <td className="fw-bold">{s.ID_Servicio}</td>
                        <td>{s.Descripcion}</td>
                        <td>{s.Movil_Nombre}</td>
                        <td style={{ minWidth: '120px' }}>
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar" role="progressbar"
                              style={{ width: `${etapa}%`, backgroundColor: label.color }}
                              aria-valuenow={etapa} aria-valuemin="0" aria-valuemax="100" />
                          </div>
                          <small className="text-muted">{etapa}%</small>
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: label.color }}>
                            {label.texto}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
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

export default Home;
